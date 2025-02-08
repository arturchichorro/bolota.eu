import { npMatrix } from "./types";

export function partialSolutionToGrid(solution: Set<number>): number[][] {
    const grid = Array(9).fill(0).map(() => Array(9).fill(0));

    for (const rowId of solution) {
        const id = rowId - 1;
        const row = Math.floor(id / 81);
        const col = Math.floor((id % 81) / 9);
        const num = (id % 9) + 1;
        
        grid[row][col] = num;
    }

    return grid;
}

export function sudokuMatrixToExactCover(sudokuMatrix: number[][]): [npMatrix, Set<number>] | undefined {
    if (sudokuMatrix.length !== 9 || sudokuMatrix[0].length !== 9) return;

    const emptySudoku = emptySudokuExactCover();
    const partialSolution = new Set<number>();

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = sudokuMatrix[row][col];
            if (num === 0) continue;

            const rowId = row * 81 + col * 9 + num;
            partialSolution.add(rowId);
        }
    }
    const sudokuExactCover = [...emptySudoku];
    let sudokuNpMatrix: npMatrix = {
        data: sudokuExactCover,
        numRows: sudokuExactCover.length,
        numCols: sudokuExactCover[0].length
    }

    for (const rowId of partialSolution) {
        sudokuNpMatrix = chooseRow(sudokuNpMatrix, sudokuNpMatrix.data.findIndex(row => row[0] === rowId));
    }

    return [sudokuNpMatrix, partialSolution];
}

export function sumColumnsExcludingFirst(npMatrix: npMatrix): number[] {
    const result = []
    if (npMatrix.data.length == 0) return []

    for (let col = 1; col < npMatrix.data[0].length; col++) {
        let sum = 0
        for (let row = 0; row < npMatrix.data.length; row++) {
            sum += npMatrix.data[row][col]
        }
        result.push(sum)
    }
    return result
}

export function chooseRow(npMatrix: npMatrix, rowIdx: number): npMatrix {
    const nRows = npMatrix.data.length;
    const nColumns = npMatrix.data[0].length;

    const rowsToDelete = new Set<number>();
    const columnsToDelete = new Set<number>();

    for (let j = 1; j < nColumns; j++) {
        if (npMatrix.data[rowIdx][j] === 1) {
            columnsToDelete.add(j);
            for (let i = 0; i < nRows; i++) {
                if (npMatrix.data[i][j] === 1) {
                    rowsToDelete.add(i);
                }
            }
        }
    }

    const reducedMatrix = deleteRows(npMatrix, Array.from(rowsToDelete));
    return deleteColumns(reducedMatrix, Array.from(columnsToDelete));
}

function deleteRows(npMatrix: npMatrix, rowIndices: number[]): npMatrix {
    const rowSet = new Set(rowIndices);
    const newData = npMatrix.data.filter((_, i) => !rowSet.has(i));
    return {
        data: newData,
        numRows: newData.length,
        numCols: newData.length > 0 ? newData[0].length : npMatrix.numCols
    }
}

function deleteColumns(npMatrix: npMatrix, colIndices: number[]): npMatrix {
    const colSet = new Set(colIndices);
    const newData = npMatrix.data.map(row => row.filter((_, j) => !colSet.has(j)));
    const nColsRemoved = colIndices.filter(num => num < npMatrix.numCols).length

    return {
        data: newData,
        numRows: newData.length,
        numCols: newData.length > 0 ? newData[0].length : npMatrix.numCols - nColsRemoved
    };
}

function _oneConstraint(row: number, size: number): number {
    return Math.floor(row / size);
}

function _rowConstraint(row: number, size: number): number {
    return size ** 2 + size * Math.floor(row / (size ** 2)) + (row % size);
}

function _colConstraint(row: number, size: number): number {
    return 2 * (size ** 2) + (row % (size ** 2));
}

function _boxConstraint(row: number, size: number): number {
    const sqrtSize = Math.sqrt(size);
    return Math.floor(3 * (size ** 2)
        + Math.floor(row / (sqrtSize * size ** 2)) * (size * sqrtSize)
        + (Math.floor(row / (sqrtSize * size)) % sqrtSize) * size
        + (row % size));
}

function emptySudokuExactCover(size: number = 9): number[][] {
    const constraints = 4 * (size ** 2);
    const rows = size ** 3;
    const matrix: number[][] = [];

    for (let r = 0; r < rows; r++) {
        const row = new Array(constraints).fill(0);
        const positions = [
            _oneConstraint(r, size),
            _rowConstraint(r, size),
            _colConstraint(r, size),
            _boxConstraint(r, size)
        ];
        positions.forEach(pos => row[pos] = 1);
        matrix.push([r + 1, ...row]);
    }

    return matrix;
}