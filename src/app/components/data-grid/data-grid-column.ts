import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Represents a column in the DataGridComponent.
 * 
 * @template T The type of data in the grid.
 */
@Component({
  selector: 't-column',
  imports: [],
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataGridColumnComponent<T> {
  @Input() name!: string;
  @Input() property!: keyof T;
  @Input() sortable: boolean = true;
}
