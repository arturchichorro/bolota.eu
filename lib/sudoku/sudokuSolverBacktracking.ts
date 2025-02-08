import { SolverRef } from "./types";

export const isValidPlacement = (grid: number[][], row: number, col: number, num: number): boolean => {
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num || grid[x][col] === num) return false;
    }
  
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  };
  
  export const createBacktrackingSolver = (
    setGrid: (grid: number[][]) => void,
    solverRef: React.MutableRefObject<SolverRef>
  ) => {
    return async function backtrack(sudokuGrid: number[][]): Promise<boolean> {
      if (solverRef.current.abort) return false;
  
      if (solverRef.current.pause) {
        await new Promise<void>((resolve) => {
          const checkPause = () => {
            if (solverRef.current.abort || !solverRef.current.pause) resolve();
            else setTimeout(checkPause, 100);
          };
          checkPause();
        });
      }
  
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (sudokuGrid[row][col] === 0) {
            for (let num = 1; num < 10; num++) {
              if (solverRef.current.abort) return false;
  
              if (isValidPlacement(sudokuGrid, row, col, num)) {
                sudokuGrid[row][col] = num;
                await new Promise(resolve => setTimeout(resolve, solverRef.current.currentDelay));
                if (!solverRef.current.abort) {
                  setGrid(JSON.parse(JSON.stringify(sudokuGrid)));
                }
                
                if (await backtrack(sudokuGrid)) return true;
                if (solverRef.current.abort) return false;
                
                sudokuGrid[row][col] = 0;
                await new Promise(resolve => setTimeout(resolve, solverRef.current.currentDelay));
                if (!solverRef.current.abort) {
                  setGrid(JSON.parse(JSON.stringify(sudokuGrid)));
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    };
  };