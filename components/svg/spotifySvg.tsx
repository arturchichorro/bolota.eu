import * as React from "react"

interface SpotifyIconProps {
    size?: number,
    color?: string
}

function SpotifyIconSVG({size = 24, color = "text-iconspotify"}: SpotifyIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={color}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        stroke="none"
        d="M238.16 481.36c-7.68-4.56-20.52-5.04-27.84-2.76-1.2.36-2.4-.36-2.76-1.44-.36-1.2.36-2.4 1.44-2.76 8.52-2.52 22.56-2.04 31.44 3.24 1.08.6 1.44 2.04.84 3.12-.6.84-2.04 1.2-3.12.6m-.24 6.72c-.6.84-1.68 1.2-2.52.6-6.48-3.96-16.32-5.16-23.88-2.76-.96.24-2.04-.24-2.28-1.2s.24-2.04 1.2-2.28c8.76-2.64 19.56-1.32 27 3.24.72.36 1.08 1.56.48 2.4m-2.88 6.6c-.48.72-1.32.96-2.04.48-5.64-3.48-12.72-4.2-21.12-2.28-.84.24-1.56-.36-1.8-1.08-.24-.84.36-1.56 1.08-1.8 9.12-2.04 17.04-1.2 23.28 2.64.84.36.96 1.32.6 2.04M224 460c-13.2 0-24 10.8-24 24s10.8 24 24 24 24-10.8 24-24-10.68-24-24-24"
        transform="translate(-200 -460)"
      />
    </svg>
  )
}
export default SpotifyIconSVG
