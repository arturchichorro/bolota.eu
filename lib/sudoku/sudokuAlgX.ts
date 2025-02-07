import { npMatrix, solve, chooseRow } from "./algx"

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

function sudokuStringToExactCover(sudokuString: string): [npMatrix, Set<number>] | undefined {
    const size = Math.sqrt(sudokuString.length);
    if (size !== 9) return;

    const emptySudoku = emptySudokuExactCover();
    const partialSolution = new Set<number>();

    for (let i = 0; i < sudokuString.length; i++) {
        const char = sudokuString[i];
        if (char === '.') continue;

        const rowId = Math.floor(i / 9) * 81 + (i % 9) * 9 + parseInt(char, 10);
        partialSolution.add(rowId);
    }

    let sudokuMatrix = [...emptySudoku];
    let sudokuNpMatrix: npMatrix = {
        data: sudokuMatrix,
        numRows: sudokuMatrix.length,
        numCols: sudokuMatrix[0].length
    }


    partialSolution.forEach(rowId => {
        sudokuNpMatrix = chooseRow(sudokuNpMatrix, sudokuNpMatrix.data.findIndex(row => row[0] === rowId));
    })

    return [sudokuNpMatrix, partialSolution];
}

function sudokuMatrixToExactCover(sudokuMatrix: number[][]): [npMatrix, Set<number>] | undefined {
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
    let sudokuExactCover = [...emptySudoku];
    let sudokuNpMatrix: npMatrix = {
        data: sudokuExactCover,
        numRows: sudokuExactCover.length,
        numCols: sudokuExactCover[0].length
    }

    partialSolution.forEach(rowId => {
        sudokuNpMatrix = chooseRow(sudokuNpMatrix, sudokuNpMatrix.data.findIndex(row => row[0] === rowId));
    })

    return [sudokuNpMatrix, partialSolution];
}

function solveSudokuStringExactCover(sudokuString: string): Set<number>[] {
    const result = sudokuStringToExactCover(sudokuString);
    if (!result) return [];
    const [sudokuMatrix, partialSolution] = result;
    const solutions: Set<number>[] = [];
    solve(sudokuMatrix, partialSolution, solutions);
    return solutions;
}

function solveSudokuMatrixExactCover(sudokuGrid: number[][]): Set<number>[] {
    const result = sudokuMatrixToExactCover(sudokuGrid);
    if (!result) return [];
    const [sudokuMatrix, partialSolution] = result;
    const solutions: Set<number>[] = [];
    solve(sudokuMatrix, partialSolution, solutions);
    return solutions;
}

function translateSolutionToSudoku(solutions: Set<number>[]): string[] {
    return solutions.map(sol => {
        const sortedSol = Array.from(sol).sort((a, b) => a - b);
        let sudoString = "";
        for (let i = 0; i < sortedSol.length; i++) {
            sudoString += (i === 0) ? sortedSol[i].toString() : (sortedSol[i] % (9 * i) !== 0 ? (sortedSol[i] % (9 * i)).toString() : "9");
        }
        return sudoString;
    });
}