import * as React from "react"

interface BuildspaceProps {
    size?: number,
    color?: string;
}

function BuildspaceSVG({size = 24, color = "text-iconblackwhite"}: BuildspaceProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={1.5}
      clipRule="evenodd"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={color}
    >
      <path
        d="M11.504 26.068c-.416-1.579 1.332-1.973 1.332-1.973l8.018 4.384-.083-3.413s-4.911-2.469-5.244-3.163c-.333-.693.194-1.637.777-1.803.583-.167 4.55 2.247 4.55 2.247l-.055-3.44-2.331-1.693c.111-.166 3.385-2.855 3.385-2.855 2.996 2.445 10.488 11.182 10.488 11.182-6.548 4.716-10.793 6.381-10.793 6.381-2.081-.888-10.044-5.854-10.044-5.854"
        transform="scale(4.16667) translate(-17.532 -19.904)scale(1.89728)"
      />
      <path
        fill="currentColor"
        strokeWidth=".53px"
        d="M11.504 26.068s7.963 4.966 10.044 5.854c0 0 4.245-1.665 10.793-6.381 0 0-7.492-8.737-10.488-11.182 0 0-3.274 2.689-3.385 2.855l2.331 1.693.055 3.44s-3.967-2.414-4.55-2.247c-.583.166-1.11 1.11-.777 1.803.333.694 5.244 3.163 5.244 3.163l.083 3.413-8.018-4.384s-1.748.394-1.332 1.973"
        transform="scale(4.16667) translate(-17.532 -19.904)scale(1.89728)"
      />
    </svg>
  )
}
export default BuildspaceSVG