type CircularProgressProps = {
    radius: number;
    segments: { value: number; color: string }[];
    total: number;
    label?: string
    labelClasses?: string,
    bgColor?: string;
};

export default function CircularProgress({
    radius,
    segments,
    total,
    label = "",
    labelClasses = "",
    bgColor = "text-gray-300",
}: CircularProgressProps) {
    
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;
    let strLinecap: "round" | "butt" = segments.length === 1 ? "round" : "butt";

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

                {segments.map((segment, index) => {
                    const segmentPercentage = (segment.value / total) * 100;
                    const strokeDashoffset = circumference - (segmentPercentage / 100) * circumference;
                    
                    const rotation = -90 + (accumulatedPercentage * 3.6); 

                    accumulatedPercentage += segmentPercentage;

                    return (
                        <circle
                            key={index}
                            cx="60"
                            cy="60"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap={strLinecap}
                            transform={`rotate(${rotation} 60 60)`}
                            className={segment.color}
                        />
                    );
                })}
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <p className={labelClasses}>{label}</p>
            </div>
        </div>
    );
}

