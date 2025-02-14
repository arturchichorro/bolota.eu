"use client"

import { useEffect, useState } from "react";
import PlayableSudoku from "./PlayableSudoku";

interface DailySudoku {
    initialGrid: number[][];
    solutionGrid: number[][];
}

const DailySudoku = () => {
    const [puzzle, setPuzzle] = useState<DailySudoku | null>(null);

    useEffect(() => {
        async function fetchPuzzle() {
            const response = await fetch("/api/daily-sudoku");
            const data: DailySudoku = await response.json();
            setPuzzle(data);
        }
        fetchPuzzle();
    }, []);

    if (!puzzle) {
        return <div>Loading...</div>;
    }

    return (
        <PlayableSudoku
            initialGrid={puzzle.initialGrid}  
            solutionGrid={puzzle.solutionGrid}
        />
    );
};

export default DailySudoku;
