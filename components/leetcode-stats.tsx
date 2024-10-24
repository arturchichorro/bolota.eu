"use client"

import { useEffect, useState } from 'react';

type LeetCodeData = {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
};

export default function LeetCodeStats() {
    const [leetCodeData, setLeetCodeData] = useState<LeetCodeData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeetCodeStats() {
            try {
                const res = await fetch("https://leetcode-api-faisalshohag.vercel.app/arturchichorro");
                const data = await res.json();
                setLeetCodeData(data);
            } catch (error) {
                console.error("Failed to fetch LeetCode stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchLeetCodeStats();
    }, []);

    if (loading) {
        return <p className="text-sm">Loading LeetCode stats...</p>;
    }

    if (!leetCodeData) {
        return <p className="text-sm">Failed to load LeetCode stats.</p>;
    }

    return (
        <div className="flex flex-row items-center gap-4 text-primary text-sm">
            
            <a target="_blank" className="link" href="https://leetcode.com/u/arturchichorro/">LeetCode Stats</a>
            <p>Total Solved: {leetCodeData.totalSolved}</p>
            <p>Easy: {leetCodeData.easySolved}</p>
            <p>Medium: {leetCodeData.mediumSolved}</p>
            <p>Hard: {leetCodeData.hardSolved}</p>
            
        </div>
    );
}
