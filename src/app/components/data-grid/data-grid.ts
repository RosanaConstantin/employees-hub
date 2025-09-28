import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, inject } from '@angular/core';
import { isObservable, Observable } from 'rxjs';
import { PaginationChangeEvent, SortChangeEvent } from '../../models/events.model';
import { CommonModule } from '@angular/common';
import { DataGridColumnComponent } from './data-grid-column';
import { Direction } from './direction.enum';

/**
 * A generic data grid component that supports sorting and pagination.
 * 
 * @template T The type of data to be displayed in the grid.
 */
@Component({
  selector: 't-grid',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './data-grid.html',
  styleUrls: ['./data-grid.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridComponent<T extends Record<string, unknown>> implements OnInit, OnChanges {
  // Inputs
  @Input() data!: T[] | Observable<T[]>;
  @Input() sortable: boolean = true;
  @Input() pageSize: number | null = null;

  // Outputs
  @Output() sortChange: EventEmitter<SortChangeEvent> = new EventEmitter<SortChangeEvent>();
  @Output() paginationChange: EventEmitter<PaginationChangeEvent> = new EventEmitter<PaginationChangeEvent>();

  @ContentChildren(DataGridColumnComponent) columns!: QueryList<DataGridColumnComponent<T>>;

  @ViewChild('dataGridContainer') dataGridContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('dataTable') dataTable!: ElementRef<HTMLTableElement>;

  sortColumn: string | null = null;
  sortDirection: Direction = Direction.NONE;
  currentPage: number = 1;
  totalPages: number = 1;
  pagedData: T[] = [];
  private pageSizes: number[] = [5, 10, 15, 25, 50];

  private static instanceCounter: number = 0;
  readonly uniqueId: string;
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    DataGridComponent.instanceCounter++;
    this.uniqueId = `${DataGridComponent.instanceCounter}-${Date.now()}`;
  }

  get pageSizeSelectId(): string {
    return `page-size-selector-${this.uniqueId}`;
  }

  // Get the available page sizes (including the one passed as input), ensuring all previously selected sizes are persisted
  get availablePageSizes(): number[] {
    if (this.pageSize && !this.pageSizes.includes(this.pageSize)) {
      this.pageSizes.push(this.pageSize);
      this.pageSizes.sort((a, b) => a - b);
    }
    return this.pageSizes;
  }

  ngOnInit(): void {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize'] || changes['sortable']) {
      this.processData();
    }
  }

  onSort(column: DataGridColumnComponent<T>): void {
    if (!column.sortable || !this.sortable) return;

    if (this.sortColumn === column.property) {
      this.sortDirection =
        this.sortDirection === Direction.ASC ? Direction.DESC : Direction.ASC;
    } else {
      this.sortColumn = column.property as string;
      this.sortDirection = Direction.ASC;
    }
    this.sortChange.emit({ columnName: this.sortColumn, direction: this.sortDirection });

    this.processData();
  }

  processData(): void {
    if (!this.data) {
      this.pagedData = [];
      this.totalPages = 1;
      this.cdr.markForCheck();
      return;
    }

    let dataArr: T[] = [];
    if (isObservable(this.data)) {
      (this.data as Observable<T[]>).subscribe(arr => {
        dataArr = arr || [];
        this.applySortAndPaginate(dataArr);
      });
    } else {
      dataArr = this.data as T[];
      this.applySortAndPaginate(dataArr);
    }
    this.cdr.markForCheck();
    return;
  }

  applySortAndPaginate(dataArr: T[]): void {
    const sorted: T[] = [...dataArr];
    if (this.sortColumn && this.sortDirection !== Direction.NONE) {
      sorted.sort((a: T, b: T) => {
        const aVal: unknown = a[this.sortColumn!];
        const bVal: unknown = b[this.sortColumn!];

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        if (aVal < bVal) return this.sortDirection === Direction.ASC ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === Direction.ASC ? 1 : -1;
        return 0;
      });
    }
    if (this.pageSize && this.pageSize > 0) {
      this.totalPages = Math.ceil(sorted.length / this.pageSize);
      const start: number = (this.currentPage - 1) * this.pageSize;
      this.pagedData = sorted.slice(start, start + this.pageSize);
    } else {
      this.totalPages = 1;
      this.pagedData = sorted;
    }
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginationChange.emit({ currentPage: this.currentPage, pageSize: this.pageSize });
    this.processData();
    
    // Scroll to table top after page change
    this.scrollToTableTop();
  }

  private scrollToTableTop(): void {
    // Use setTimeout to ensure DOM updates are complete
    setTimeout(() => {
      if (this.dataGridContainer?.nativeElement) {
        this.dataGridContainer.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 50);
  }

  setPageSize(event: Event): void {
    const select: HTMLSelectElement | null = event.target as HTMLSelectElement | null;
    const value: string = typeof select?.value === 'string' ? select.value : '';
    this.pageSize = value === '' || value === 'null' ? null : +value;
    this.currentPage = 1;
    this.paginationChange.emit({ currentPage: this.currentPage, pageSize: this.pageSize });
    this.processData();
    
    this.scrollToTableTop();
  }

  // Accessibility helper method for aria-sort attribute
  getSortState(column: DataGridColumnComponent<T>): string {
    if (!column.sortable || !this.sortable) return 'none';
    if (this.sortColumn === column.property) {
      return this.sortDirection === Direction.ASC ? 'ascending' : 'descending';
    }
    return 'none';
  }
}