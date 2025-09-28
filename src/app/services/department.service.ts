import { Injectable, inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { EmployeeService } from "./employee.service";
import { Department } from "../models/department.model";

/**
 * Service for managing department data
 * Provides insights into department-wise employee distribution and capacity
 */
@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private readonly employeeService: EmployeeService = inject(EmployeeService);
    
    private readonly departmentCapacities: Record<string, number> = {
        'Engineering': 10,
        'HR': 5,
        'Marketing': 7,
        'Sales': 4,
        'Finance': 6,
        'Support': 4,
        'Services': 4
    };
    readonly departments$: Observable<Department[]>;

    constructor() {
        this.departments$ = this.employeeService.employees$.pipe(
            map(employees => {
                const departmentMap: Record<string, number> = {};
                employees.forEach(emp => {
                    departmentMap[emp.department] = (departmentMap[emp.department] || 0) + 1;
                });
                return Object.entries(this.departmentCapacities).map(([name, maxCapacity]) => {
                    const currentCount: number = departmentMap[name] || 0;
                    const vacancyPercentage: number = maxCapacity ? Math.floor((maxCapacity - currentCount) / maxCapacity * 100) : 0;
                    return {
                        name,
                        currentEmployees: currentCount,
                        maxCapacity,
                        vacancyPercentage: vacancyPercentage < 0 ? 0 : vacancyPercentage,
                    };
                });
            })
        );
    }
}