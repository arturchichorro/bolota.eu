import * as React from "react";

interface SimpleAiIconProps {
    size?: number,
    color?: string,
}

const SimpleAiSVG = ({size = 24, color = "text-accent"}: SimpleAiIconProps) => (
  <svg
    viewBox="0 0 100 100"
    fill="#F9C600"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={color}
  >
    <path
      d="M70 10C72 25 82 30 95 32C82 34 72 39 70 54C68 39 58 34 45 32C58 30 68 25 70 10Z"
      transform="translate(70, 32) scale(1.2, 1.6) translate(-70, -32)"
    />
    <path
      d="M30 45C32 55 38 60 50 62C38 64 32 69 30 79C28 69 22 64 10 62C22 60 28 55 30 45Z"
      transform="translate(30, 62) scale(1.2, 1.6) translate(-30, -61)"
    />
    <path
      d="M22 5C23 12 27 15 35 16C27 17 23 20 22 27C21 20 17 17 9 16C17 15 21 12 22 5Z"
      transform="translate(22, 16) scale(1, 1.4) translate(-22, -16)"
    />
  </svg>
);
export default SimpleAiSVG;
