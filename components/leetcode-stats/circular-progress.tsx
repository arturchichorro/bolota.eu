type CircularProgressProps = {
    radius: number;
    progress: number;
    total: number;
    bgColor?: string,
    barColor?: string
};

export default function CircularProgress({
    radius,
    progress, 
    total, 
    bgColor = "text-gray-300", 
    barColor = "text-green-500"
}: CircularProgressProps) {
    
    const solvedPercentage = (progress / total) * 100;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (solvedPercentage / 100) * circumference;

    return (
        <div className="relative">
            <svg height="120" width="120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className={bgColor}
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={"rotate(-90 60 60)"}
                    className={barColor}
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-bold">{progress}</p>
            </div>
        </div>
    );
}
