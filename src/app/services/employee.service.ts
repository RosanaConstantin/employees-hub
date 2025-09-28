import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Employee } from "../models/employee.model";

/**
 * Service for managing employee data
 */
@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private readonly _employees = new BehaviorSubject<Employee[]>([
        { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', department: 'Engineering' },
        { id: 2, firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', department: 'HR' },
        { id: 3, firstName: 'Carol', lastName: 'Wilson', email: 'carol@example.com', department: 'Engineering' },
        { id: 4, firstName: 'David', lastName: 'Brown', email: 'david@example.com', department: 'Marketing' },
        { id: 5, firstName: 'Eva', lastName: 'Davis', email: 'eva@example.com', department: 'Engineering' },
        { id: 6, firstName: 'Frank', lastName: 'Miller', email: 'frank@example.com', department: 'HR' },
        { id: 7, firstName: 'Grace', lastName: 'Taylor', email: 'grace@example.com', department: 'Marketing' },
        { id: 8, firstName: 'Tom', lastName: 'Anderson', email: 'tom@example.com', department: 'Sales' },
        { id: 9, firstName: 'Adam', lastName: 'Johnson', email: 'adam@example.com', department: 'Finance' },
        { id: 10, firstName: 'Henry', lastName: 'Anderson', email: 'henry@example.com', department: 'Finance' },
        { id: 11, firstName: 'Patricia', lastName: 'Anderson', email: 'patricia@example.com', department: 'Finance' },
        { id: 12, firstName: 'Michael', lastName: 'Wilson', email: 'michael@example.com', department: 'Engineering' },
        { id: 13, firstName: 'Linda', lastName: 'Garcia', email: 'linda@example.com', department: 'Finance' },
        { id: 14, firstName: 'James', lastName: 'Martinez', email: 'james@example.com', department: 'Engineering' },
        { id: 15, firstName: 'Emily', lastName: 'Lopez', email: 'emily@example.com', department: 'Marketing' },
        { id: 16, firstName: 'Michael', lastName: 'Garcia', email: 'michael@example.com', department: 'Sales' },
        { id: 17, firstName: 'Sophia', lastName: 'Martinez', email: 'sophia@example.com', department: 'Engineering' },
        { id: 18, firstName: 'Daniel', lastName: 'Hernandez', email: 'daniel@example.com', department: 'HR' },
        { id: 19, firstName: 'Olivia', lastName: 'Lopez', email: 'olivia@example.com', department: 'Marketing' },
        { id: 20, firstName: 'Liam', lastName: 'Smith', email: 'liam@example.com', department: 'Sales' },
        { id: 21, firstName: 'Ava', lastName: 'Garcia', email: 'ava@example.com', department: 'Engineering' },
        { id: 22, firstName: 'William', lastName: 'Martinez', email: 'william@example.com', department: 'Finance' },
        { id: 23, firstName: 'Isabella', lastName: 'Hernandez', email: 'isabella@example.com', department: 'Marketing' },
        { id: 24, firstName: 'Ethan', lastName: 'Lopez', email: 'ethan@example.com', department: 'Sales' },
        { id: 25, firstName: 'Mia', lastName: 'Clark', email: 'mia@example.com', department: 'Engineering' },
        { id: 26, firstName: 'Fav', lastName: 'Jen', email: 'fav@example.com', department: 'Support' },
        { id: 27, firstName: 'Noah', lastName: 'Thompson', email: 'noah@example.com', department: 'Support' },
        { id: 28, firstName: 'Emma', lastName: 'White', email: 'emma@example.com', department: 'Support' },
        { id: 29, firstName: 'Lucas', lastName: 'Harris', email: 'lucas@example.com', department: 'Services' }
    ]);

    readonly employees$ = this._employees.asObservable();
}