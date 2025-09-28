import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard';

/**
 * Main application component
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, EmployeeDashboardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  readonly title = signal('Employee Hub Management');
}
