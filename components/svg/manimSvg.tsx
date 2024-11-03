import * as React from "react"

interface ManimProps {
    size?: number,
    color?: string;
}

function ManimSVG({size = 24, color = "text-iconmanim"}: ManimProps) {
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
      width = {size}
      height = {size}
      className = {color}
    >
      <path
        fill="#e07a5f"
        d="m30.004 23.264 3.088 5.539h-6.176z"
        transform="scale(5.55556) translate(-23.42 -23.96)scale(2.03535) matrix(1.1396 0 0 1.09897 -3.576 -2.517)"
      />
      <path
        fill="#454866"
        d="M22.651 19.699H30.036V26.956000000000003H22.651z"
        transform="scale(5.55556) translate(-23.42 -23.96)scale(2.03535) matrix(1.09602 0 0 1.09019 -2.284 -2.377)"
      />
      <circle
        cx={23.893}
        cy={27.625}
        r={3.597}
        fill="#81b29a"
        transform="scale(5.55556) translate(-23.42 -23.96)scale(2.03535) matrix(1.14155 0 0 1.12765 -4.7 -4.05)"
      />
      <g fill="none" stroke="currentColor" strokeWidth=".55px">
        <path
          d="M17.468 25.477s-3.471-8.361-3.738-8.411l-.1 7.826"
          transform="scale(5.55556) translate(-23.42 -23.96)scale(2.03535)"
        />
        <path
          d="M13.655 24.774s.359.782 1.369.782-2.51-.032-2.51-.032.946-.196 1.141-.75M12.462 16.999l2.87-.017s2.57 6.642 2.904 6.475M17.436 25.621l3.618-8.67.033 8.019s-.652.586-1.108.586h3.976s-1.467-.489-1.173-.684l-.066-7.073s.489-.815 1.174-.815-2.836-.033-2.836-.033"
          transform="scale(5.55556) translate(-23.42 -23.96)scale(2.03535)"
        />
      </g>
    </svg>
  )
}
export default ManimSVG
