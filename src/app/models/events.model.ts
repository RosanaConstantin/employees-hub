import { Direction } from "../components/data-grid/direction.enum";

/**
 * Event emitted when the sorting changes in the DataGridComponent.
 */
export interface SortChangeEvent {
  columnName: string;
  direction: Direction;
}

/**
 * Event emitted when the pagination changes in the DataGridComponent.
 */
export interface PaginationChangeEvent {
  currentPage: number;
  pageSize: number | null;
}