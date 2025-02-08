import { sudokuMatrixToExactCover, sumColumnsExcludingFirst, chooseRow, partialSolutionToGrid } from './exactCover';
import { SolverRef, npMatrix } from './types';

export const createAlgorithmXSolver = (
  setGrid: (grid: number[][]) => void,
  solverRef: React.MutableRefObject<SolverRef>
) => {
  return async function solve(initialGrid: number[][]) {
    const solutions: Set<number>[] = [];
    
    async function* solveSudokuWithYield(grid: number[][]): AsyncGenerator<Set<number>> {
      const result = sudokuMatrixToExactCover(grid);
      if (!result) return;
      
      const [matrix, partialSolution] = result;
      
      async function* solveStep(
        matrix: npMatrix,
        partial: Set<number>
      ): AsyncGenerator<Set<number>> {
        if (solverRef.current.abort) return;
        
        if (matrix.numCols === 1) {
          yield partial;
          return;
        }

        if (solverRef.current.pause) {
          await new Promise<void>((resolve) => {
            const checkPause = () => {
              if (solverRef.current.abort || !solverRef.current.pause) resolve();
              else setTimeout(checkPause, 100);
            };
            checkPause();
          });
        }
        
        const columnSums = sumColumnsExcludingFirst(matrix);
        const minColIdx = columnSums.indexOf(Math.min(...columnSums)) + 1;
        const candidateRows = matrix.data
          .map((row, rIdx) => (row[minColIdx] === 1 ? rIdx : -1))
          .filter(rIdx => rIdx !== -1);

        if (candidateRows.length === 0) return;

        for (const rowIdx of candidateRows) {
          const newPartial = new Set(partial);
          newPartial.add(matrix.data[rowIdx][0]);
          
          const currentGrid = partialSolutionToGrid(newPartial);
          if (!solverRef.current.abort) {
            setGrid(currentGrid);
            await new Promise(resolve => setTimeout(resolve, solverRef.current.currentDelay));
          }
          
          const reducedMatrix = chooseRow(matrix, rowIdx);
          yield* solveStep(reducedMatrix, newPartial);
        }
      }
      
      yield* solveStep(matrix, partialSolution);
    }

    for await (const partial of solveSudokuWithYield(initialGrid)) {
      if (solverRef.current.abort) break;
      solutions.push(partial);
    }
    
    return solutions;
  };
};