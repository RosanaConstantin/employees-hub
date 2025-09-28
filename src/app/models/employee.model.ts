/**
 * Employee model interface
 */
export interface Employee extends Record<string, unknown> {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}