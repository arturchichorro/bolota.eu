import { isValidPlacement } from "./sudokuSolverBacktracking";
import { solveSudokuMatrixExactCover, translateSolutionToSudoku } from "./exactCover";
import { deepCopy, shuffleArray } from "../utils";
import { sudokuStringToSudokuGrid } from "./sudokuUtils";

export function generateFilledSudoku(): number[][] {
    const grid: number[][] = Array(9).fill(0).map(() => Array(9).fill(0))

    function fillGrid(grid: number[][]): boolean {
        for (let row = 0; row < 9; row ++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const randomNumbers = Array.from({length: 9}, (_, i) => i+1)
                        .sort(() => Math.random() - 0.5);
                    for (const num of randomNumbers) {
                        if (isValidPlacement(grid, row, col, num)) {
                            grid[row][col] = num;

                            if (fillGrid(grid)) {
                                return true
                            }

                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    fillGrid(grid)
    return grid
}

export async function generateSudoku(): Promise<number[][]> {
    return new Promise((resolve) => {
        setTimeout(() => {  // Simulate async behavior
            const sudokuGrid: number[][] = generateFilledSudoku();
            const positions: [number, number][] = [];
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    positions.push([r, c]);
                }
            }
            shuffleArray(positions);

            while (positions.length > 0) {
                const [r, c] = positions.pop() as [number, number];
                const temp = sudokuGrid[r][c];
                sudokuGrid[r][c] = 0;

                const tempGrid = deepCopy(sudokuGrid);
                if (solveSudokuMatrixExactCover(tempGrid).length > 1) {
                    sudokuGrid[r][c] = temp;
                }
            }

            resolve(sudokuGrid);
        }, 0);
    });
}

export async function generateSudokuAndSolution(): Promise<{ initialGrid: number[][], solutionGrid: number[][] }> {
    const initialGrid: number[][] = await generateSudoku()
    const solutionGrid: number[][] = sudokuStringToSudokuGrid(translateSolutionToSudoku(solveSudokuMatrixExactCover(initialGrid))[0])
    return {
        initialGrid,
        solutionGrid
    }
}