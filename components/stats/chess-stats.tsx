"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProgressBar from './progress-bar';
import CircularProgress from './circular-progress';

type ChessData = {
    win: number;
    loss: number;
    draw: number;
    totalGames: number;
};

export default function ChessStats() {
    const [chessData, setChessData] = useState<ChessData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cacheKey = 'chessData';
        const cacheExpirationKey = 'chessDataExpiration';
        const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

        const fetchChessStats = async () => {
            try {
                const res = await fetch("https://api.chess.com/pub/player/rook_three_pointer/stats");
                const data = await res.json();

                // Extract the relevant stats
                const win = data.chess_blitz.record.win;
                const loss = data.chess_blitz.record.loss;
                const draw = data.chess_blitz.record.draw;
                const totalGames = win + loss + draw;

                setChessData({ win, loss, draw, totalGames });

                // Store data in local storage with an expiration time
                localStorage.setItem(cacheKey, JSON.stringify({ win, loss, draw, totalGames }));
                localStorage.setItem(cacheExpirationKey, Date.now().toString());
            } catch (error) {
                console.error("Failed to fetch Chess.com stats:", error);
            } finally {
                setLoading(false);
            }
        };

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheExpirationKey);

        if (cachedData && cachedTime) {
            const expirationTime = parseInt(cachedTime) + cacheDuration;

            if (Date.now() < expirationTime) {
                setChessData(JSON.parse(cachedData));
                setLoading(false);
                return;
            }
        }

        fetchChessStats();
    }, []);

    if (loading) {
        return <p className="text-sm">Loading Chess.com stats...</p>;
    }

    if (!chessData) {
        return;
    }

    return (
        <div className="bg-popover border-2 border-border rounded-md px-4 py-2 w-full max-w-96">
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col justify-center items-center">
                    <Link target="_blank" href="https://www.chess.com/member/rook_three_pointer" className="link text-sm text-nowrap">
                        Chess.com Stats
                    </Link>
                    <CircularProgress
                        radius={40}
                        total={chessData.totalGames}
                        segments={[
                            { value: chessData.win, color: "text-green-500" },
                            { value: chessData.draw, color: "text-yellow-500" },
                            { value: chessData.loss, color: "text-red-500" },
                        ]}
                        label={`${chessData.win}W/${chessData.draw}D/${chessData.loss}L`}
                        bgColor="text-input"
                    />
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                    <ProgressBar
                        label='Wins'
                        solvedNumber={chessData.win}
                        totalNumber={chessData.totalGames}
                        bgColor='bg-input'
                        barColor="bg-green-500"
                    />
                    <ProgressBar
                        label='Draws'
                        solvedNumber={chessData.draw}
                        totalNumber={chessData.totalGames}
                        bgColor='bg-input'
                        barColor="bg-yellow-500"
                    />
                    <ProgressBar
                        label='Losses'
                        solvedNumber={chessData.loss}
                        totalNumber={chessData.totalGames}
                        bgColor='bg-input'
                        barColor="bg-red-500"
                    />
                </div>
            </div>
        </div>
    );
}
