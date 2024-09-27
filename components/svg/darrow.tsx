import React from "react";

interface DArrowProps {
  size?: number,
  color?: string;
}

function DArrow({ size = 12, color="currentColor" }: DArrowProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={color}
    >
      <path
        fill="currentColor"
        d="M19.924 13.617A1 1 0 0019 13h-3V3a1 1 0 00-1-1H9a1 1 0 00-1 1v10H5a1 1 0 00-.707 1.707l7 7a1 1 0 001.414 0l7-7a1 1 0 00.217-1.09z"
        data-name="Down"
      ></path>
    </svg>
  );
}

export default DArrow;
