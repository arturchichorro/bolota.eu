export const speedToDelay = (speed: number): number => {
    return Math.round(201 - (speed * 2));
};

export function sudokuStringToSudokuGrid(sudokuString: string): number[][] {
  const result: number[][] = [];
  let idx: number = 0;
  for (let r = 0; r < 9; r++) {
      const row: number[] = []
      for (let c = 0; c < 9; c++) {
          if (idx >= sudokuString.length) break;
          const char = sudokuString[idx++];
          row.push(char !== "." ? Number(char) : 0);
      }
      result.push(row);
  }
  return result
}