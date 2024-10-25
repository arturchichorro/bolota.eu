"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import CircularProgress from './circular-progress';
import WDLBar from './win-draw-loss-bar';

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

                localStorage.setItem(cacheKey, JSON.stringify(transformedData));
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
    const totalWins = chessData.blitzWins + chessData.rapidWins + chessData.bulletWins
    const totalDraws = chessData.blitzDraws + chessData.rapidDraws + chessData.bulletDraws
    const totalLosses = chessData.blitzLosses + chessData.rapidLosses + chessData.bulletLosses
    const totalGames = totalWins + totalDraws + totalLosses


    return (
        <div className="bg-popover border-2 border-border rounded-md px-4 py-2 w-full max-w-96">
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col justify-evenly items-center">
                    <p className="link text-sm text-nowrap">Chess.com Stats</p>
                    <CircularProgress
                        radius={40}
                        total={totalGames}
                        segments={[
                            { value: totalWins, color: "text-green-500"},
                            { value: totalDraws, color: "hidden" },
                            { value: totalLosses, color: "text-red-500"},
                        ]}
                        label={`${totalGames}`}
                        labelClasses="text-xl font-bold text-secondary-foreground"
                        bgColor="text-input"
                    />
                    <p className="text-sm text-center">W/D/L: {totalWins}/{totalDraws}/{totalLosses}</p>
                </div>
                <div className="col-span-2 flex flex-col gap-y-6 py-4">
                    <WDLBar 
                        label="Rapid" 
                        wins={chessData.rapidWins} 
                        draws={chessData.rapidDraws} 
                        losses={chessData.rapidLosses}
                        rating={chessData.rapidRating}
                        highest={chessData.rapidHighest}
                    />
                    <WDLBar 
                        label="Blitz" 
                        wins={chessData.blitzWins} 
                        draws={chessData.blitzDraws} 
                        losses={chessData.blitzLosses}
                        rating={chessData.blitzRating}
                        highest={chessData.blitzHighest}
                    />
                    <WDLBar 
                        label="Bullet" 
                        wins={chessData.bulletWins} 
                        draws={chessData.bulletDraws} 
                        losses={chessData.bulletLosses}
                        rating={chessData.bulletRating}
                        highest={chessData.bulletHighest}
                    />
                </div>
            </div>
        </div>
    );
}
