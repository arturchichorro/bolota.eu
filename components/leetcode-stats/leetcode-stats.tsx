"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProgressBar from './progress-bar';

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
        const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

        const fetchLeetCodeStats = async () => {
            try {
                const res = await fetch("https://leetcode-api-faisalshohag.vercel.app/arturchichorro");
                const data = await res.json();
                setLeetCodeData({ ...data});

                localStorage.setItem(cacheKey, JSON.stringify({ ...data, totalQuestions: 3329 }));
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
        return <p>Loading LeetCode stats...</p>;
    }

    if (!leetCodeData) {
        return <p>Failed to load LeetCode stats.</p>;
    }

    const solvedPercentage = (leetCodeData.totalSolved / leetCodeData.totalQuestions) * 100;

    const easySolvedPercentage = (leetCodeData.easySolved / leetCodeData.totalEasy) * 100;
    const mediumSolvedPercentage = (leetCodeData.mediumSolved / leetCodeData.totalMedium) * 100;
    const hardSolvedPercentage = (leetCodeData.hardSolved / leetCodeData.totalHard) * 100;


    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (solvedPercentage / 100) * circumference;

    return (
        <div className="bg-popover border-2 border-border rounded-md px-4 py-2 w-full max-w-96">
            
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col justify-center items-center">
                    <Link target="_blank" href="https://leetcode.com/u/arturchichorro/" className="link text-sm">
                        LeetCode Stats
                    </Link>
                    <div className="relative">
                        <svg height="120" width="120">
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#e5e7eb"
                                strokeWidth="10"
                                fill="transparent"
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                stroke="#22c55e"
                                strokeWidth="10"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                transform="rotate(-90 60 60)"
                            />
                        </svg>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-xl font-bold">{leetCodeData.totalSolved}</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-2 flex flex-col gap-2">
                    <ProgressBar
                        difficulty='Easy'
                        solvedNumber={leetCodeData.easySolved}
                        totalNumber={leetCodeData.totalEasy}
                        barColor="bg-green-500"
                    />
                    <ProgressBar
                        difficulty='Medium'
                        solvedNumber={leetCodeData.mediumSolved}
                        totalNumber={leetCodeData.totalMedium}
                        barColor="bg-yellow-500"
                    />
                    <ProgressBar
                        difficulty='Hard'
                        solvedNumber={leetCodeData.hardSolved}
                        totalNumber={leetCodeData.totalHard}
                        barColor="bg-red-500"
                    />
                </div>
            </div>
        
        </div>
    );
}
