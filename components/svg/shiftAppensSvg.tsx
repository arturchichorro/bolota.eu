import * as React from "react"

interface ShiftAppensIconProps {
    size?: number,
    color?: string,
}

function ShiftAppensSVG({size = 24, color = "text-accent"}: ShiftAppensIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      fillRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      clipRule="evenodd"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={color}
    >
      <path
        fill="#db2b48"
        d="M40.198 11.548c.058-.132.16-.213.27-.213s.212.081.27.213l6.509 14.805a.95.95 0 0 1 .013.698c-.085.219-.247.355-.422.355H33.87c-.129 0-.249-.1-.311-.262a.7.7 0 0 1 .01-.516z"
        transform="translate(-.72 2.05) matrix(1.7134 0 0 1.20103 -34.821 -4.308)"
      />
      <path
        fill="#db2b48"
        d="M41.033 30.509c.303 0 .549.261.549.582v2.576a.6.6 0 0 1-.161.412.53.53 0 0 1-.388.17H26.36a.47.47 0 0 1-.454-.481v-2.696c0-.149.056-.292.155-.398a.52.52 0 0 1 .376-.165z"
        transform="translate(-.72 2.05) matrix(1.23745 0 0 1.1672 -7.387 -5.201)"
      />
      <path
        fill="#db2b48"
        d="M18.744 25.257v5.9c0 .567-.226 1.111-.63 1.511-.403.401-.95.626-1.52.626H5.501a1.474 1.474 0 0 1-1.478-1.47v-5.206c0-.752.612-1.361 1.368-1.361z"
        transform="translate(-.72 2.05) matrix(1.16018 0 0 1.1672 -2.152 -3.586)"
      />
      <path
        fill="#db2b48"
        d="M16.821 25.257c1.062 0 1.923.856 1.923 1.912v4.213c0 .507-.203.994-.563 1.352-.361.359-.85.56-1.361.56H4.023v-6.37c0-.92.75-1.667 1.677-1.667z"
        transform="translate(-.72 2.05) matrix(1.16018 0 0 1.1672 3.274 -20.862)"
      />
      <path
        fill="#db2b48"
        d="M18.812 18.333v5.968c0 .22-.202.432-.561.588s-.847.244-1.355.244H8.382v-6.8z"
        transform="translate(-.72 2.05) matrix(1.11788 0 0 2.57368 -1.448 -29.402)"
      />
    </svg>
  )
}
export default ShiftAppensSVG
