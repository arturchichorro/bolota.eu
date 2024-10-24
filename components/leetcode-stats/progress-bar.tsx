import React from 'react';

type ProgressBarProps = {
    solvedNumber: number;
    totalNumber: number;
    bgColor?: string; 
    barColor?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
    solvedNumber,
    totalNumber,
    bgColor = 'bg-gray-300',
    barColor = 'bg-green-500',
}) => {
    const solvedPercentage = solvedNumber > 0 ? (solvedNumber / totalNumber) * 100 : 2;

    return (
        <div className="grid grid-cols-6 items-center gap-2">
            
            <p className="flex justify-center items-center h-full">{solvedNumber}</p>
            
            <div className={`relative w-full min-w-20 h-2 ${bgColor} rounded col-span-4`}>
                <div
                    className={`absolute h-2 ${barColor} rounded-md inset-0`}
                    style={{ width: `${solvedPercentage}%` }}
                />
            </div>

            <p className="flex justify-center items-center h-full">{totalNumber}</p>
        </div>
    );
};

export default ProgressBar;
