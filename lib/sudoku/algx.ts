export interface npMatrix {
    data: number[][];
    numRows: number;
    numCols: number;
}

function solveExactCover(matrix: number[][]): Set<number>[] {
    const rowIdentifiers = Array.from({ length: matrix.length }, (_, index) => [index + 1]);
    const matrixWithIds = rowIdentifiers.map((id, idx) => [...id, ...matrix[idx]]);

    const npMatrixWithIds: npMatrix = {
        data: matrixWithIds,
        numRows: matrixWithIds.length,
        numCols: matrixWithIds[0]?.length || 0
    }

    const solutions: Set<number>[] = [];
    solve(npMatrixWithIds, new Set(), solutions);
    return solutions;
}

export function solve(npMatrix: npMatrix, partialSolution: Set<number>, solutions: Set<number>[]): void {
    if (npMatrix.numCols === 1) {
        solutions.push(partialSolution);
        return;
    }

    const columnSums = sumColumnsExcludingFirst(npMatrix);
    const minColIdx = columnSums.indexOf(Math.min(...columnSums)) + 1;
    const candidateRows = npMatrix.data
        .map((row, rIdx) => (row[minColIdx] === 1 ? rIdx : -1))
        .filter(rIdx => rIdx !== -1);

    if (candidateRows.length === 0) return;

    for (const rowIdx of candidateRows) {
        const newPartialSolution = new Set(partialSolution);
        newPartialSolution.add(npMatrix.data[rowIdx][0]);
        const reducedMatrix = chooseRow(npMatrix, rowIdx);
        solve(reducedMatrix, newPartialSolution, solutions);
    }
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

function sumColumnsExcludingFirst(npMatrix: npMatrix): number[] {
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
