export interface npMatrix {
  data: number[][];
  numRows: number;
  numCols: number;
}

export interface SudokuGrid {
  grid: number[][];
  initialGrid: number[][];
}
  
export interface SolverRef {
  pause: boolean;
  abort: boolean;
  currentDelay: number;
}