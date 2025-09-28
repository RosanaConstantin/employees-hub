import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, inject } from '@angular/core';

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
export class ProgressIndicatorComponent implements OnInit, OnChanges {
  private _radius: number = 50;
  private _progress: number = 0;
  
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
  private previousProgress: number = 0;
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['progress'] || changes['radius'] || changes['color']) {
      this.cdr.markForCheck();
    }
  }

  private initializeComponent(): void {
    this.calculateCircleProperties();
  }

  private calculateCircleProperties(): void {
    this.diameter = this.radius * 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.strokeDashoffset = this.circumference - (this.progress / 100) * this.circumference;
  }

  private scheduleCompletionEvent(): void {
    setTimeout(() => {
      this.complete.emit();
    }, 300);
  }

  get svgSize(): number {
    return this.diameter + 20;
  }

  get centerPosition(): number {
    return this.svgSize / 2;
  }

  get strokeWidth(): number {
    return Math.max(2, this.radius * 0.1);
  }
}
