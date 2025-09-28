import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { PaginationChangeEvent, SortChangeEvent } from '../../models/events.model';
import { DataGridComponent } from '../data-grid/data-grid';
import { DataGridColumnComponent } from '../data-grid/data-grid-column';
import { ProgressIndicatorComponent } from '../progress-indicator/progress-indicator';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';

/**
 * Component for displaying the employee dashboard
 */
@Component({
  selector: 'employee-dashboard',
  standalone: true,
  imports: [CommonModule, DataGridComponent, DataGridColumnComponent, ProgressIndicatorComponent],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeDashboardComponent {
  private readonly employeeService: EmployeeService = inject(EmployeeService);
  private readonly departmentService: DepartmentService = inject(DepartmentService);
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  
  readonly employees$: Observable<Employee[]>;
  readonly departments$: Observable<Department[]>;

  constructor() {
    this.employees$ = this.employeeService.employees$;
    this.departments$ = this.departmentService.departments$;

    this.employees$.subscribe(employees => {
      console.log('Employees loaded:', employees);
      this.cdr.markForCheck();
    });
    
    this.departments$.subscribe(departments => {
      console.log('Departments loaded:', departments);
      this.cdr.markForCheck();
    });
  }

  getDepartmentProgressColor(percentage: number): string {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 50) return '#fd7e14';
    return '#dc3545';
  }

  onEmployeeSortChange(event: SortChangeEvent): void {
    console.log('Employee sort changed:', event);
  }

  onEmployeePaginationChange(event: PaginationChangeEvent): void {
    console.log('Employee pagination changed:', event);
  }

  onDeptSortChange(event: SortChangeEvent): void {
    console.log('Department sort changed:', event);
  }

  onDeptPaginationChange(event: PaginationChangeEvent): void {
    console.log('Department pagination changed:', event);
  }
}
