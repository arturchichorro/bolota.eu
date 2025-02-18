"use client"

import { useEffect, useState } from "react";
import PlayableSudoku from "./PlayableSudoku";
import { generateSudokuAndSolution } from "@/lib/sudoku/generateSudoku";

const GeneratedSudoku = () => {
    const [sudoku, setSudoku] = useState<{ initialGrid: number[][], solutionGrid: number[][] } | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSudoku = async () => {
        setLoading(true);
        const generated = await generateSudokuAndSolution();
        setSudoku(generated);
        setLoading(false);
    };

    useEffect(() => {
        fetchSudoku();
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4">
            {loading ? (
                <p>Loading Sudoku...</p>
            ) : sudoku ? (
                <PlayableSudoku initialGrid={sudoku.initialGrid} solutionGrid={sudoku.solutionGrid} />
            ) : (
                <p>Failed to generate Sudoku</p>
            )}

            <button 
                onClick={fetchSudoku}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
            >
                {loading ? "Generating..." : "Generate New Puzzle"}
            </button>
        </div>
    );
};

export default GeneratedSudoku;
