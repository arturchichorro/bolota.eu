import { isValidPlacement } from "./sudokuHelper";

export function solveSudokuBacktracking(sudokuGrid: number[][]) {
    function backtrack(sudokuGrid: number[][]) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (sudokuGrid[row][col] === 0) {
                    for (let num = 1; num < 10; num++) {
                        if (isValidPlacement(sudokuGrid, row, col, num)) {
                            sudokuGrid[row][col] = num
                            if (backtrack(sudokuGrid)) return true;
                            sudokuGrid[row][col] = 0
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    backtrack(sudokuGrid)
}
