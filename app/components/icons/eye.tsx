export const EyeFilled = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <defs>
        <clipPath id="lineMdWatchTwotone0">
          <rect width={24} height={12}></rect>
        </clipPath>
        <symbol id="lineMdWatchTwotone1">
          <path
            fill="#fff"
            fillOpacity={0}
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z"
            clipPath="url(#lineMdWatchTwotone0)"
          >
            <animate
              fill="freeze"
              attributeName="d"
              dur="0.5s"
              values="M23 16.5C23 11.5 18.0751 12 12 12C5.92487 12 1 11.5 1 16.5z;M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z"
            ></animate>
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              begin="0.6s"
              dur="0.15s"
              values="0;0.3"
            ></animate>
          </path>
        </symbol>
        <mask id="lineMdWatchTwotone2">
          <use href="#lineMdWatchTwotone1"></use>
          <use href="#lineMdWatchTwotone1" transform="rotate(180 12 12)"></use>
          <circle cx={12} cy={12} r={0} fill="#fff">
            <animate
              fill="freeze"
              attributeName="r"
              dur="0.2s"
              values="0;3"
            ></animate>
          </circle>
        </mask>
      </defs>
      <rect
        width={24}
        height={24}
        fill="currentColor"
        mask="url(#lineMdWatchTwotone2)"
      ></rect>
    </svg>
  );
};

export const EyeSlashFilled = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <defs>
        <clipPath id="lineMdWatchOffTwotone0">
          <rect width={24} height={12}></rect>
        </clipPath>
        <symbol id="lineMdWatchOffTwotone1">
          <path
            fill="#fff"
            fillOpacity={0}
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z"
            clipPath="url(#lineMdWatchOffTwotone0)"
          >
            <animate
              fill="freeze"
              attributeName="d"
              dur="0.5s"
              values="M23 16.5C23 11.5 18.0751 12 12 12C5.92487 12 1 11.5 1 16.5z;M23 16.5C23 10.4249 18.0751 5.5 12 5.5C5.92487 5.5 1 10.4249 1 16.5z"
            ></animate>
            <animate
              fill="freeze"
              attributeName="fill-opacity"
              begin="0.6s"
              dur="0.15s"
              values="0;0.3"
            ></animate>
          </path>
        </symbol>
        <mask id="lineMdWatchOffTwotone2">
          <use href="#lineMdWatchOffTwotone1"></use>
          <use
            href="#lineMdWatchOffTwotone1"
            transform="rotate(180 12 12)"
          ></use>
          <circle cx={12} cy={12} r={0} fill="#fff">
            <animate
              fill="freeze"
              attributeName="r"
              dur="0.2s"
              values="0;3"
            ></animate>
          </circle>
          <g
            fill="none"
            strokeDasharray={26}
            strokeDashoffset={26}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            transform="rotate(45 13 12)"
          >
            <path stroke="#000" d="M0 11h24"></path>
            <path stroke="#fff" d="M1 13h22"></path>
            <animate
              fill="freeze"
              attributeName="stroke-dashoffset"
              begin="0.8s"
              dur="0.2s"
              values="26;0"
            ></animate>
          </g>
        </mask>
      </defs>
      <rect
        width={24}
        height={24}
        fill="currentColor"
        mask="url(#lineMdWatchOffTwotone2)"
      ></rect>
    </svg>
  );
};
