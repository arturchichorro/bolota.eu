import React from 'react';

type WDLBarProps = {
    label: string;
    wins: number;
    draws: number;
    losses: number;
    rating: number;
    highest: number;
    bgColor?: string;
    winTextColor?: string;
    drawTextColor?: string;
    lossTextColor?: string; 
    winColor?: string;
    drawColor?: string;
    lossColor?: string;
};

const WDLBar: React.FC<WDLBarProps> = ({
    label,
    wins,
    draws,
    losses,
    rating,
    highest,
    winTextColor = 'text-green-500',
    drawTextColor = 'text-muted-foreground',
    lossTextColor = 'text-red-500',
    winColor = 'bg-green-500',
    drawColor = 'bg-input',
    lossColor = 'bg-red-500',
}) => {
    const totalGames = wins + draws + losses;
    const winPercentage = totalGames > 0 ? (wins / totalGames) * 100 : 0;
    const drawPercentage = totalGames > 0 ? (draws / totalGames) * 100 : 0;
    const lossPercentage = totalGames > 0 ? (losses / totalGames) * 100 : 0;

    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-row justify-between text-xs">
                <p>{label} Rating: {rating}</p>
                <p>Highest: {highest}</p>
            </div>
            <div className={`relative w-full min-w-10 min-h-2`}>
                <div
                    className={`absolute h-full ${winColor} rounded-l-md`}
                    style={{ width: `${winPercentage}%` }}
                />
                <div
                    className={`absolute h-full ${drawColor}`}
                    style={{ width: `${drawPercentage}%`, left: `${winPercentage}%` }}
                />
                <div
                    className={`absolute h-full ${lossColor} rounded-r-md`}
                    style={{ width: `${lossPercentage}%`, left: `${winPercentage + drawPercentage}%` }}
                />
            </div>
            <div className={`relative w-full min-h-2 min-w-10`}>
                <span 
                    className={`absolute h-full flex justify-start text-xs ${winTextColor}`}
                    style={{ width: `${winPercentage}%` }}
                >
                    {wins} Won
                </span>
                <span 
                    className={`absolute h-full flex justify-center text-xs ${drawTextColor}`}
                    style={{ width: `${drawPercentage}%`, left: `${winPercentage}%` }}
                >
                    {draws}
                </span>
                <span 
                    className={`absolute flex justify-end text-xs ${lossTextColor}`}
                    style={{ width: `${lossPercentage}%`, left: `${winPercentage + drawPercentage}%` }}
                >
                    {losses} Lost
                </span>
            </div>
        </div>
    );
};

export default WDLBar;
