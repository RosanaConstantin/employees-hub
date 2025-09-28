import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EmployeeDashboardComponent } from './employee-dashboard';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { DataGridComponent } from '../data-grid/data-grid';
import { DataGridColumnComponent } from '../data-grid/data-grid-column';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator';
import { Direction } from '../data-grid/direction.enum';
import { PaginationChangeEvent, SortChangeEvent } from '../../models/events.model';

describe('EmployeeDashboardComponent', () => {
  let component: EmployeeDashboardComponent;
  let fixture: ComponentFixture<EmployeeDashboardComponent>;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  let mockDepartmentService: jasmine.SpyObj<DepartmentService>;

  const mockEmployees: Employee[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', department: 'Engineering' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', department: 'HR' },
    { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', department: 'Engineering' }
  ];

  const mockDepartments: Department[] = [
    { name: 'Engineering', currentEmployees: 8, maxCapacity: 10, vacancyPercentage: 20 },
    { name: 'HR', currentEmployees: 4, maxCapacity: 5, vacancyPercentage: 20 }
  ];

  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', [], {
      employees$: of(mockEmployees)
    });

    mockDepartmentService = jasmine.createSpyObj('DepartmentService', [], {
      departments$: of(mockDepartments)
    });

    await TestBed.configureTestingModule({
      imports: [
        EmployeeDashboardComponent,
        DataGridComponent,
        DataGridColumnComponent,
        ProgressIndicatorComponent
      ],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService },
        { provide: DepartmentService, useValue: mockDepartmentService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize employees$ observable from service', () => {
      expect(component.employees$).toBeDefined();

      component.employees$.subscribe(employees => {
        expect(employees).toEqual(mockEmployees);
        expect(employees.length).toBe(3);
      });
    });

    it('should initialize departments$ observable from service', () => {
      expect(component.departments$).toBeDefined();

      component.departments$.subscribe(departments => {
        expect(departments).toEqual(mockDepartments);
        expect(departments.length).toBe(2);
      });
    });
  });

  describe('getDepartmentProgressColor', () => {
    it('should return green color for percentage >= 90 (including decimals, higher values)', () => {
      expect(component.getDepartmentProgressColor(90)).toBe('#28a745');
      expect(component.getDepartmentProgressColor(95)).toBe('#28a745');
      expect(component.getDepartmentProgressColor(90.1)).toBe('#28a745');
      expect(component.getDepartmentProgressColor(100)).toBe('#28a745');
      expect(component.getDepartmentProgressColor(150)).toBe('#28a745');
    });

    it('should return yellow color for percentage >= 70 and < 90', () => {
      expect(component.getDepartmentProgressColor(70)).toBe('#ffc107');
      expect(component.getDepartmentProgressColor(80)).toBe('#ffc107');
      expect(component.getDepartmentProgressColor(89.9)).toBe('#ffc107');
      expect(component.getDepartmentProgressColor(89)).toBe('#ffc107');
    });

    it('should return orange color for percentage >= 50 and < 70', () => {
      expect(component.getDepartmentProgressColor(50)).toBe('#fd7e14');
      expect(component.getDepartmentProgressColor(60)).toBe('#fd7e14');
      expect(component.getDepartmentProgressColor(69)).toBe('#fd7e14');
    });

    it('should return red color for percentage < 50, including negatives', () => {
      expect(component.getDepartmentProgressColor(0)).toBe('#dc3545');
      expect(component.getDepartmentProgressColor(25)).toBe('#dc3545');
      expect(component.getDepartmentProgressColor(49)).toBe('#dc3545');
      expect(component.getDepartmentProgressColor(-10)).toBe('#dc3545');
    });
  });

  describe('Event Handlers', () => {
    beforeEach(() => {
      spyOn(console, 'log'); // Spy on console.log to verify it's called
    });

    it('should handle employee sort change', () => {
      const sortEvent: SortChangeEvent = { columnName: 'firstName', direction: Direction.ASC };

      component.onEmployeeSortChange(sortEvent);

      expect(console.log).toHaveBeenCalledWith('Employee sort changed:', sortEvent);
    });

    it('should handle employee pagination change', () => {
      const paginationEvent: PaginationChangeEvent = { currentPage: 2, pageSize: 10 };

      component.onEmployeePaginationChange(paginationEvent);

      expect(console.log).toHaveBeenCalledWith('Employee pagination changed:', paginationEvent);
    });

    it('should handle department sort change', () => {
      const sortEvent: SortChangeEvent = { columnName: 'name', direction: Direction.DESC };

      component.onDeptSortChange(sortEvent);

      expect(console.log).toHaveBeenCalledWith('Department sort changed:', sortEvent);
    });

    it('should handle department pagination change', () => {
      const paginationEvent: PaginationChangeEvent = { currentPage: 1, pageSize: 5 };

      component.onDeptPaginationChange(paginationEvent);

      expect(console.log).toHaveBeenCalledWith('Department pagination changed:', paginationEvent);
    });
  });

  describe('Service Integration', () => {
    it('should use EmployeeService to get employees data', () => {
      expect(component.employees$).toBe(mockEmployeeService.employees$);
    });

    it('should use DepartmentService to get departments data', () => {
      expect(component.departments$).toBe(mockDepartmentService.departments$);
    });
  });
});