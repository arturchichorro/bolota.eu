import React from 'react';

type ProgressBarProps = {
    label: string;
    solvedNumber: number;
    totalNumber: number;
    bgColor?: string; 
    barColor?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
    label,
    solvedNumber,
    totalNumber,
    bgColor = 'bg-gray-300',
    barColor = 'bg-green-500',
}) => {
    const solvedPercentage = solvedNumber > 0 ? Math.ceil((solvedNumber / totalNumber) * 100) : 2;

    return (
        <div className="grid grid-rows-2 items-center">
            <div className={`flex flex-row justify-between text-sm`}>
                <p>{label}</p>
                <p>{solvedNumber} / {totalNumber}</p>
            </div>
            <div className={`relative w-full min-w-10 h-2 ${bgColor} rounded`}>
                <div
                    className={`absolute h-2 ${barColor} rounded-md inset-0`}
                    style={{ width: `${solvedPercentage}%` }}
                />
            </div>

        </div>
    );
};

export default ProgressBar;
