"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProgressBar from './progress-bar';
import CircularProgress from './circular-progress';

type ChessData = {
    blitzWins: number;
    blitzLosses: number;
    blitzDraws: number;
    blitzRating: number;
    blitzHighest: number;
    rapidWins: number;
    rapidLosses: number;
    rapidDraws: number;
    rapidRating: number;
    rapidHighest: number;
    bulletWins: number;
    bulletLosses: number;
    bulletDraws: number;
    bulletRating: number;
    bulletHighest: number;
};

export default function ChessStats() {
    const [chessData, setChessData] = useState<ChessData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cacheKey = 'chessData';
        const cacheExpirationKey = 'chessDataExpiration';
        const cacheDuration = 60 * 60 * 1000;

        const fetchChessStats = async () => {
            try {
                const res = await fetch("https://api.chess.com/pub/player/rook_three_pointer/stats");
                const data = await res.json();

                const transformedData: ChessData = {
                    blitzWins: data.chess_blitz.record.win,
                    blitzLosses: data.chess_blitz.record.loss,
                    blitzDraws: data.chess_blitz.record.draw,
                    blitzRating: data.chess_blitz.last.rating,
                    blitzHighest: data.chess_blitz.best.rating,
                    rapidWins: data.chess_rapid.record.win,
                    rapidLosses: data.chess_rapid.record.loss,
                    rapidDraws: data.chess_rapid.record.draw,
                    rapidRating: data.chess_rapid.last.rating,
                    rapidHighest: data.chess_rapid.best.rating,
                    bulletWins: data.chess_bullet.record.win,
                    bulletLosses: data.chess_bullet.record.loss,
                    bulletDraws: data.chess_bullet.record.draw,
                    bulletRating: data.chess_bullet.last.rating,
                    bulletHighest: data.chess_bullet.best.rating,
                };
                setChessData(transformedData);

                localStorage.setItem(cacheKey, JSON.stringify({ ...data}));
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

    console.log(chessData)

    return (
        <div className="bg-popover border-2 border-border rounded-md px-4 py-2 w-full max-w-96">
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col justify-center items-center">
                    <p className="link text-sm text-nowrap">Chess.com Stats</p>
                    {/* <CircularProgress
                        radius={40}
                        total={chessData.}
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
                    /> */}
                </div>
            </div>
        </div>
    );
}
