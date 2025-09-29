import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DataGridComponent } from './data-grid';
import { DataGridColumnComponent } from './data-grid-column';
import { Component, ElementRef, Input, QueryList } from '@angular/core';
import { Direction } from './direction.enum';
import { of } from 'rxjs';

@Component({
  selector: 't-grid-column',
  template: ''
})
class MockDataGridColumnComponent<T> {
  @Input() property!: keyof T;
  @Input() sortable: boolean = true;
}

describe('DataGridComponent', () => {
  let component: DataGridComponent<Record<string, unknown>>;
  let fixture: ComponentFixture<DataGridComponent<Record<string, unknown>>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridComponent, MockDataGridColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process array data and paginate', () => {
    component.data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' }
    ];
    component.pageSize = 2;
    component.ngOnInit();
    expect(component.pagedData.length).toBe(2);
    expect(component.totalPages).toBe(2);
  });

  it('should process observable data with fakeAsync', fakeAsync(() => {
    component.data = of([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' }
    ]);
    component.pageSize = 2;
    component.ngOnInit();

    tick();

    expect(component.pagedData.length).toBe(2);
    expect(component.totalPages).toBe(2);
    expect(component.pagedData[0]['id']).toBe(1);
    expect(component.pagedData[1]['id']).toBe(2);
  }));

  it('should sort data when onSort is called', () => {
    component.data = [
      { id: 2, name: 'B' },
      { id: 1, name: 'A' }
    ];
    component.pageSize = null;
    component.columns = {
      find: () => ({ property: 'id', sortable: true })
    } as unknown as QueryList<DataGridColumnComponent<Record<string, unknown>>>;
    component.ngOnInit();

    const column: DataGridColumnComponent<Record<string, unknown>> = { property: 'id', sortable: true } as DataGridColumnComponent<Record<string, unknown>>;
    component.onSort(column);
    expect(component.sortColumn).toBe('id');
    expect(component.sortDirection).toBe(Direction.ASC);
    expect(component.pagedData[0]['id']).toBe(1);
  });

  it('should toggle sort direction on same column', () => {
    component.data = [
      { id: 1 }, { id: 2 }
    ];
    component.ngOnInit();

    const column: DataGridColumnComponent<Record<string, unknown>> = { property: 'id', sortable: true } as DataGridColumnComponent<Record<string, unknown>>;
    component.onSort(column); // ASC
    component.onSort(column); // DESC
    expect(component.sortDirection).toBe(Direction.DESC);
  });

  it('should emit sortChange event', () => {
    spyOn(component.sortChange, 'emit');
    component.data = [{ id: 1 }, { id: 2 }];
    component.ngOnInit();

    const column: DataGridColumnComponent<Record<string, unknown>> = { property: 'id', sortable: true } as DataGridColumnComponent<Record<string, unknown>>;
    component.onSort(column);
    expect(component.sortChange.emit).toHaveBeenCalledWith({
      columnName: 'id',
      direction: Direction.ASC
    });
  });

  it('should emit paginationChange event on changePage', () => {
    spyOn(component.paginationChange, 'emit');
    component.data = [{ id: 1 }, { id: 2 }];
    component.pageSize = 1;
    component.ngOnInit();
    component.changePage(2);
    expect(component.currentPage).toBe(2);
    expect(component.paginationChange.emit).toHaveBeenCalledWith({
      currentPage: 2,
      pageSize: 1
    });
  });

  it('should not change page if out of bounds', () => {
    component.data = [{ id: 1 }, { id: 2 }];
    component.pageSize = 1;
    component.ngOnInit();
    component.changePage(0);
    expect(component.currentPage).toBe(1);
    component.changePage(3);
    expect(component.currentPage).toBe(1);
  });

  it('should set page size and reset to first page', () => {
    spyOn(component.paginationChange, 'emit');
    component.data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    component.pageSize = 1;
    component.ngOnInit();
    const event: Event = { target: { value: '2' } } as unknown as Event;
    component.setPageSize(event);
    expect(component.pageSize).toBe(2);
    expect(component.currentPage).toBe(1);
    expect(component.paginationChange.emit).toHaveBeenCalledWith({
      currentPage: 1,
      pageSize: 2
    });
  });

  it('should handle null or empty page size', () => {
    component.data = [{ id: 1 }, { id: 2 }];
    component.pageSize = 1;
    component.ngOnInit();
    const event: Event = { target: { value: '' } } as unknown as Event;
    component.setPageSize(event);
    expect(component.pageSize).toBeNull();
  });

  it('should generate unique pageSizeSelectId', () => {
    expect(component.pageSizeSelectId).toContain('page-size-selector-');
  });

  it('should scroll to table top on page change', (done) => {
    component.dataGridContainer = {
      nativeElement: {
        scrollIntoView: jasmine.createSpy('scrollIntoView')
      }
    } as unknown as ElementRef<HTMLDivElement>;
    component.data = [{ id: 1 }, { id: 2 }];
    component.pageSize = 1;
    component.ngOnInit();
    component.changePage(2);
    setTimeout(() => {
      expect(component.dataGridContainer.nativeElement.scrollIntoView).toHaveBeenCalled();
      done();
    }, 100);
  });
});