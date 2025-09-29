import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';

import { ProgressIndicatorComponent } from './progress-indicator';

describe('ProgressIndicatorComponent', () => {
  let component: ProgressIndicatorComponent;
  let fixture: ComponentFixture<ProgressIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressIndicatorComponent]
    })
      .overrideComponent(ProgressIndicatorComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProgressIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.radius).toBe(50);
      expect(component.progress).toBe(0);
      expect(component.color).toBe('#007bff');
    });

    it('should set minimum radius to 50 when smaller value is provided', () => {
      component.radius = 30;
      component.ngOnInit();
      expect(component.radius).toBe(50);
    });

    it('should keep radius unchanged when value is greater than 50', () => {
      component.radius = 75;
      component.ngOnInit();
      expect(component.radius).toBe(75);
    });

    it('should clamp progress to 0-100 range', () => {
      // negative progress
      component.progress = -10;
      component.ngOnInit();
      expect(component.progress).toBe(0);

      // progress over 100
      component.progress = 150;
      component.ngOnInit();
      expect(component.progress).toBe(100);

      // valid progress
      component.progress = 50;
      component.ngOnInit();
      expect(component.progress).toBe(50);
    });
  });

  describe('Circle Calculations', () => {
    beforeEach(() => {
      component.radius = 60;
      component.progress = 75;
      component.ngOnInit();
    });

    it('should calculate diameter correctly', () => {
      expect(component.diameter).toBe(120);
    });

    it('should calculate circumference correctly', () => {
      const expectedCircumference: number = 2 * Math.PI * 60;
      expect(component.circumference).toBeCloseTo(expectedCircumference, 2);
    });

    it('should calculate strokeDashoffset correctly', () => {
      const circumference: number = 2 * Math.PI * 60;
      const expectedOffset: number = circumference - (75 / 100) * circumference;
      expect(component.strokeDashoffset).toBeCloseTo(expectedOffset, 2);
    });

    it('should update strokeDashoffset when progress changes', () => {
      const initialOffset: number = component.strokeDashoffset;

      component.progress = 50;
      component.ngOnInit();

      expect(component.strokeDashoffset).not.toBe(initialOffset);
    });
  });

  describe('Complete Event Emission', () => {
    it('should emit complete event when progress reaches 100 from below 100', fakeAsync(() => {
      spyOn(component.complete, 'emit');

      component.progress = 95;
      component.ngOnInit();

      // Simulate progress change to 100
      component.progress = 100;
      component.ngOnChanges({
        progress: {
          currentValue: 100,
          previousValue: 95,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      tick(300);

      expect(component.complete.emit).toHaveBeenCalled();
    }));

    it('should not emit complete event when progress stays at 100', fakeAsync(() => {
      spyOn(component.complete, 'emit');

      component.progress = 100;
      tick(300);

      (component.complete.emit as jasmine.Spy).calls.reset();

      component.progress = 100;

      tick(300);

      expect(component.complete.emit).not.toHaveBeenCalled();
    }));

    it('should not emit complete event when progress decreases from 100', fakeAsync(() => {
      spyOn(component.complete, 'emit');

      component.progress = 100;
      tick(300);

      (component.complete.emit as jasmine.Spy).calls.reset();

      component.progress = 90;

      tick(300);

      expect(component.complete.emit).not.toHaveBeenCalled();
    }));

    it('should emit complete event only once when crossing 100 threshold', fakeAsync(() => {
      spyOn(component.complete, 'emit');

      component.progress = 95;
      component.ngOnInit();

      // First change to 100
      component.progress = 100;
      component.ngOnChanges({
        progress: {
          currentValue: 100,
          previousValue: 95,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      // Second change to 100 (should not emit again)
      component.ngOnChanges({
        progress: {
          currentValue: 100,
          previousValue: 100,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      tick(300);

      expect(component.complete.emit).toHaveBeenCalledTimes(1);
    }));

    it('should handle multiple completion cycles correctly', fakeAsync(() => {
      spyOn(component.complete, 'emit');

      // First completion cycle
      component.progress = 95;
      component.ngOnInit();

      component.progress = 100;
      component.ngOnChanges({
        progress: {
          currentValue: 100,
          previousValue: 95,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      tick(300);

      // Second completion cycle - go back to 80, then to 100 again
      component.progress = 80;
      component.ngOnChanges({
        progress: {
          currentValue: 80,
          previousValue: 100,
          firstChange: false,
          isFirstChange: () => false
        }
      });

      component.progress = 100;
      component.ngOnChanges({
        progress: {
          currentValue: 100,
          previousValue: 80,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      tick(300);

      expect(component.complete.emit).toHaveBeenCalledTimes(2);
    }));
  });

  describe('Input Property Changes', () => {
    it('should recalculate properties when radius changes', () => {
      component.radius = 40;
      component.ngOnInit();

      const initialDiameter: number = component.diameter;
      const initialCircumference: number = component.circumference;

      component.radius = 80;
      component.ngOnInit();

      expect(component.diameter).not.toBe(initialDiameter);
      expect(component.circumference).not.toBe(initialCircumference);
    });

    it('should update progress display when progress changes', () => {
      component.progress = 30;
      fixture.detectChanges();

      let progressText: DebugElement = fixture.debugElement.query(By.css('.progress-percentage'));
      expect(progressText.nativeElement.textContent).toBe('30%');

      component.progress = 80;
      fixture.detectChanges();

      progressText = fixture.debugElement.query(By.css('.progress-percentage'));
      expect(progressText.nativeElement.textContent).toBe('80%');
    });

    it('should update color when color property changes', () => {
      component.color = '#00ff00';
      fixture.detectChanges();

      const progressCircle: DebugElement = fixture.debugElement.query(By.css('.progress-bar'));
      const progressText: DebugElement = fixture.debugElement.query(By.css('.progress-text'));

      expect(progressCircle.nativeElement.getAttribute('stroke')).toBe('#00ff00');
      expect(progressText.nativeElement.style.color).toBe('rgb(0, 255, 0)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero radius (should be set to minimum 50)', () => {
      component.radius = 0;
      component.ngOnInit();

      expect(component.radius).toBe(50);
      expect(component.diameter).toBe(100);
    });

    it('should handle very large radius values', () => {
      component.radius = 1000;
      component.ngOnInit();

      expect(component.radius).toBe(1000);
      expect(component.diameter).toBe(2000);
      expect(component.svgSize).toBe(2020);
    });

    it('should handle decimal progress values', () => {
      component.progress = 33.7;
      component.ngOnInit();

      expect(component.progress).toBe(33.7);

      fixture.detectChanges();
      const progressText: DebugElement = fixture.debugElement.query(By.css('.progress-percentage'));
      expect(progressText.nativeElement.textContent).toBe('33.7%');
    });

    it('should handle empty color string', () => {
      component.color = '';
      fixture.detectChanges();

      const progressCircle: DebugElement = fixture.debugElement.query(By.css('.progress-bar'));
      expect(progressCircle.nativeElement.getAttribute('stroke')).toBe('');
    });
  });
});