import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, Output, inject } from '@angular/core';

/**
 * A circular progress indicator component.
 */
@Component({
  selector: 't-progress',
  imports: [],
  templateUrl: './progress-indicator.html',
  styleUrls: ['./progress-indicator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressIndicatorComponent implements OnInit, OnChanges, OnDestroy {
  private _radius: number = 50;
  private _progress: number = 0;
  private completionTimeout: number | undefined;

  // Validation of value constraint
  @Input()
  get radius(): number {
    return this._radius;
  }
  set radius(value: number) {
    this._radius = Math.max(50, value || 50);
    if (this.cdr) {
      this.calculateCircleProperties();
      this.cdr.markForCheck();
    }
  }

  // Validation of value constraint
  @Input()
  get progress(): number {
    return this._progress;
  }
  set progress(value: number) {
    const previousProgress = this._progress;
    this._progress = Math.max(0, Math.min(100, value || 0));

    if (this.cdr) {
      this.calculateCircleProperties();

      if (this.diameter && previousProgress < 100 && this._progress >= 100) {
        this.scheduleCompletionEvent();
      }

      this.cdr.markForCheck();
    }
  }

  @Input() color: string = '#007bff';
  @Output() complete: EventEmitter<void> = new EventEmitter<void>();

  diameter!: number;
  circumference!: number;
  strokeDashoffset!: number;
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress'] || changes['radius'] || changes['color']) {
      this.cdr.markForCheck();
    }
  }

  /**
   * Initializes the component by calculating the circle properties.
   */
  private initializeComponent(): void {
    this.calculateCircleProperties();
  }

  /**
   * Calculates the properties of the circular progress indicator.
   */
  private calculateCircleProperties(): void {
    this.diameter = this.radius * 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.strokeDashoffset = this.circumference - (this.progress / 100) * this.circumference;
  }

  /**
   * Schedules the completion event to be emitted after a delay.
   */
  private scheduleCompletionEvent(): void {
    if (this.completionTimeout) {
      clearTimeout(this.completionTimeout);
    }

    this.completionTimeout = window.setTimeout(() => {
      this.complete.emit();
    }, 300);
  }

  /**
   * Gets the size of the SVG element.
   */
  get svgSize(): number {
    return this.diameter + 20;
  }

  /**
   * Gets the center position of the SVG element.
   */
  get centerPosition(): number {
    return this.svgSize / 2;
  }

  /**
   * Gets the stroke width of the circular progress indicator.
   */
  get strokeWidth(): number {
    return Math.max(2, this.radius * 0.1);
  }

  ngOnDestroy(): void {
    if (this.completionTimeout) {
      clearTimeout(this.completionTimeout);
    }
  }
}
