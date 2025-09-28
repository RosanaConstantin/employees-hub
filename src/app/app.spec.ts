import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard';
import { CommonModule } from '@angular/common';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, EmployeeDashboardComponent, App]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct title signal value', () => {
    expect(component.title()).toBe('Employee Hub Management');
  });

  it('should render the title in the template', () => {
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Employee Hub Management');
  });
});