export interface CleanupStats {
  lastCleanupAt: string | null;
  rowsRemovedAtLastCleanup: number;
}

export const cleanupStats: CleanupStats = {
  lastCleanupAt: null,
  rowsRemovedAtLastCleanup: 0,
};
