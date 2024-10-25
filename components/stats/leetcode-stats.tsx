"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProgressBar from './progress-bar';
import CircularProgress from './circular-progress';

type LeetCodeData = {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalEasy: number;
    totalMedium: number;
    totalHard: number;
    totalQuestions: number;
};

export default function LeetCodeStats() {
    const [leetCodeData, setLeetCodeData] = useState<LeetCodeData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cacheKey = 'leetCodeData';
        const cacheExpirationKey = 'leetCodeDataExpiration';
        const cacheDuration = 60 * 60 * 1000;

        const fetchLeetCodeStats = async () => {
            try {
                const res = await fetch("https://leetcode-api-faisalshohag.vercel.app/arturchichorro");
                const data = await res.json();
                setLeetCodeData({ ...data});

                localStorage.setItem(cacheKey, JSON.stringify({ ...data}));
                localStorage.setItem(cacheExpirationKey, Date.now().toString());
            } catch (error) {
                console.error("Failed to fetch LeetCode stats:", error);
            } finally {
                setLoading(false);
            }
        };

        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheExpirationKey);

        if (cachedData && cachedTime) {
            const expirationTime = parseInt(cachedTime) + cacheDuration;

            if (Date.now() < expirationTime) {
                setLeetCodeData(JSON.parse(cachedData));
                setLoading(false);
                return;
            }
        }

        fetchLeetCodeStats();
    }, []);

    if (loading) {
        return <p className="text-sm flex justify-center">Loading LeetCode stats...</p>;
    }

    if (!leetCodeData) {
        return;
    }

    return (
        <div className="bg-popover border-2 border-border rounded-md px-4 py-2 w-full max-w-96 flex justify-center items-center">
            
            <div className="grid grid-cols-5 gap-4 h-full">
                <div className="col-span-2 flex flex-col justify-evenly items-center">
                    <Link target="_blank" href="https://leetcode.com/u/arturchichorro/" className="link text-sm text-nowrap">
                        LeetCode Stats
                    </Link>
                    <CircularProgress
                        radius={50}
                        total={leetCodeData.totalQuestions}
                        segments={[
                            { value: leetCodeData.totalSolved, color: "text-accent"},
                        ]}
                        label= {`${leetCodeData.totalSolved}`}
                        labelClasses="text-xl font-bold text-secondary-foreground"
                        bgColor="text-input"
                    />
                </div>
                <div className="col-span-3 flex flex-col justify-around gap-2">
                    <ProgressBar
                        label='Easy'
                        solvedNumber={leetCodeData.easySolved}
                        totalNumber={leetCodeData.totalEasy}
                        bgColor='bg-input'
                        barColor="bg-green-500"
                    />
                    <ProgressBar
                        label='Medium'
                        solvedNumber={leetCodeData.mediumSolved}
                        totalNumber={leetCodeData.totalMedium}
                        bgColor='bg-input'
                        barColor="bg-yellow-500"
                    />
                    <ProgressBar
                        label='Hard'
                        solvedNumber={leetCodeData.hardSolved}
                        totalNumber={leetCodeData.totalHard}
                        bgColor='bg-input'
                        barColor="bg-red-500"
                    />
                </div>
            </div>
        
        </div>
    );
}
