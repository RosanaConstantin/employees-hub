import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, inject } from '@angular/core';
import { isObservable, Observable, Subscription } from 'rxjs';
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
export class DataGridComponent<T extends Record<string, unknown>> implements OnInit, OnChanges, OnDestroy {
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
  availablePageSizes: number[] = [];
  private readonly pageSizes: number[] = [5, 10, 15, 25, 50];
  private readonly customPageSizes: Set<number> = new Set<number>();
  private currentData: T[] = [];

  private static instanceCounter: number = 0;
  readonly uniqueId: string;
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private dataSubscription: Subscription | null = null;

  constructor() {
    DataGridComponent.instanceCounter++;
    this.uniqueId = `${DataGridComponent.instanceCounter}-${Date.now()}`;
  }

  /**
   * Gets the unique ID for the page size selector element.
   */
  get pageSizeSelectId(): string {
    return `page-size-selector-${this.uniqueId}`;
  }

  ngOnInit(): void {
    if (this.pageSize && this.pageSize > 0 && !this.pageSizes.includes(this.pageSize)) {
      this.customPageSizes.add(this.pageSize);
    }
    this.updateAvailablePageSizes();
    this.setupDataSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.setupDataSubscription();
    } else if (changes['pageSize']) {
      if (this.pageSize && this.pageSize > 0 && !this.pageSizes.includes(this.pageSize)) {
        this.customPageSizes.add(this.pageSize);
      }
      this.updateAvailablePageSizes();
      this.processLatestData();
    } else if (changes['sortable']) {
      this.processLatestData();
    }
  }

  /**
   * Handles the sorting of the data grid.
   * @param column The column to sort by.
   * @returns void
   */
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

    this.processLatestData();
  }

  /**
   * Sets up the data subscription for the data grid.
   * @returns void
   */
  private setupDataSubscription(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = null;
    }

    if (!this.data) {
      this.currentData = [];
      this.pagedData = [];
      this.totalPages = 1;
      this.cdr.markForCheck();
      return;
    }

    if (isObservable(this.data)) {
      this.dataSubscription = this.data.subscribe(arr => {
        this.currentData = arr || [];
        this.applySortAndPaginate(this.currentData);
        this.cdr.markForCheck();
      });
    } else {
      this.currentData = this.data;
      this.applySortAndPaginate(this.currentData);
      this.cdr.markForCheck();
    }
  }

  /**
   * Processes the latest data for sorting and pagination.
   */
  private processLatestData(): void {
    this.applySortAndPaginate(this.currentData);
    this.cdr.markForCheck();
  }

  /**
   * Applies sorting and pagination to the data array.
   * @param dataArr The data array to process.
   */
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

  /**
   * Changes the current page of the data grid.
   * @param page The new page number.
   * @returns void
   */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.paginationChange.emit({ currentPage: this.currentPage, pageSize: this.pageSize });
    this.processLatestData();

    // Scroll to table top after page change
    this.scrollToTableTop();
  }

  /**
   * Scrolls the data grid container to the top.
   */
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

  /**
   * Sets the page size for the data grid.
   * @param event The change event from the page size select element.
   */
  setPageSize(event: Event): void {
    const select: HTMLSelectElement | null = event.target as HTMLSelectElement | null;
    const value: string = typeof select?.value === 'string' ? select.value : '';
    this.pageSize = value === '' || value === 'null' ? null : +value;
    this.currentPage = 1;
    this.paginationChange.emit({ currentPage: this.currentPage, pageSize: this.pageSize });
    this.processLatestData();

    this.scrollToTableTop();
  }

  /**
   * Updates the available page sizes array.
   */
  private updateAvailablePageSizes(): void {
    const allPageSizes: Set<number> = new Set<number>([...this.pageSizes, ...this.customPageSizes]);
    if (this.pageSize && this.pageSize > 0) {
      allPageSizes.add(this.pageSize);
    }
    this.availablePageSizes = Array.from(allPageSizes).sort((a, b) => a - b);
  }

  /**
   * Gets the sort state for a specific column.
   * @param column The column to check.
   * @returns The sort state of the column.
   */
  getSortState(column: DataGridColumnComponent<T>): string {
    if (!column.sortable || !this.sortable) return 'none';
    if (this.sortColumn === column.property) {
      return this.sortDirection === Direction.ASC ? 'ascending' : 'descending';
    }
    return 'none';
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}