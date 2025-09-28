/**
 * Department model interface
 */
export interface Department extends Record<string, unknown> {
  name: string;
  currentEmployees: number;
  maxCapacity: number;
  vacancyPercentage: number;
}
