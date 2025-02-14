import { generateSudokuAndSolution } from "@/lib/sudoku/generateSudoku";

export const runtime = 'edge';

export async function GET() {
    const currentTime = Date.now();

    const { initialGrid, solutionGrid } = generateSudokuAndSolution();
    const cachedPuzzle = { initialGrid, solutionGrid, timestamp: currentTime };

    return new Response(JSON.stringify(cachedPuzzle), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
        },
    });
}
