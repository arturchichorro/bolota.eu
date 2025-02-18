"use client"

import { useEffect, useState } from "react";
import PlayableSudoku from "./PlayableSudoku";
import { generateSudokuAndSolution } from "@/lib/sudoku/generateSudoku";
import { Button } from "../ui/button";

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
                <p>Generating Sudoku...</p>
            ) : sudoku ? (
                <PlayableSudoku initialGrid={sudoku.initialGrid} solutionGrid={sudoku.solutionGrid} />
            ) : (
                <p>Failed to generate Sudoku</p>
            )}

            <Button 
                onClick={fetchSudoku}
                disabled={loading}
                variant="secondary"
            >
                {loading ? "Generating..." : "Generate New Puzzle"}
            </Button>
        </div>
    );
};

export default GeneratedSudoku;
