import * as React from "react"

interface ReactIconProps {
    size?: number,
    color?: string;
}

function ReactIconSVG({size=24, color="text-iconreact"}: ReactIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={1.5}
      clipRule="evenodd"
      viewBox="0 0 267 267"
      width={size}
      height={size}
      className={color}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.34px"
        d="M17.848 11.086s-4.965 2.419 2.292 15.851c0 0 7.576 12.223 12.414 9.804s-2.228-14.897-2.865-15.788c-.636-.891-6.366-11.204-11.841-9.867"
        transform="scale(5.55556) translate(-11.49 -9.679)scale(1.40627) translate(-.191 -.064)"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.34px"
        d="M17.848 11.086s-4.965 2.419 2.292 15.851c0 0 7.576 12.223 12.414 9.804s-2.228-14.897-2.865-15.788c-.636-.891-6.366-11.204-11.841-9.867"
        transform="scale(5.55556) translate(-11.49 -9.679)scale(1.40627) rotate(61.322 25.204 23.873)"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.34px"
        d="M17.848 11.086s-4.965 2.419 2.292 15.851c0 0 7.576 12.223 12.414 9.804s-2.228-14.897-2.865-15.788c-.636-.891-6.366-11.204-11.841-9.867"
        transform="scale(5.55556) translate(-11.49 -9.679)scale(1.40627) rotate(121.298 25.2 23.962)"
      />
      <ellipse
        cx={25.679}
        cy={24.041}
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.34px"
        rx={2.101}
        ry={2.005}
        transform="scale(5.55556) translate(-11.49 -9.679)scale(1.40627) translate(-.637 -.064)"
      />
    </svg>
  )
}
export default ReactIconSVG
