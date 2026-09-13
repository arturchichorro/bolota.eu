interface HomeHubIconProps {
    size?: number;
}

function HomeHubSVG({ size = 24 }: HomeHubIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 512 512"
            aria-hidden="true"
        >
            <rect width="512" height="512" rx="112" fill="#201d1b" />
            <path
                d="M126 234 242 138Q256 126 270 138L386 234Q400 246 400 264v96q0 18-18 18H130q-18 0-18-18v-96q0-18 14-30Z"
                fill="#e8753d"
            />
        </svg>
    );
}

export default HomeHubSVG;
