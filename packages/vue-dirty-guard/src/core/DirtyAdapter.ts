/**
 * Interface for a dirty adapter.
 */
export interface DirtyAdapter {
  id: string;
  isDirty(): boolean;
  reset(): void;
  description?: string;
}
