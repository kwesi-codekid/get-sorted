export const AnimatedEditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="currentColor" fillOpacity={0} d="M20 7L17 4L15 6L18 9L20 7Z">
      <animate
        fill="freeze"
        attributeName="fill-opacity"
        begin="1.2s"
        dur="0.15s"
        values="0;0.3"
      ></animate>
    </path>
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    >
      <path strokeDasharray={20} strokeDashoffset={20} d="M3 21H21">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          dur="0.3s"
          values="20;0"
        ></animate>
      </path>
      <path
        strokeDasharray={44}
        strokeDashoffset={44}
        d="M7 17V13L17 3L21 7L11 17H7"
      >
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="0.4s"
          dur="0.6s"
          values="44;0"
        ></animate>
      </path>
      <path strokeDasharray={8} strokeDashoffset={8} d="M14 6L18 10">
        <animate
          fill="freeze"
          attributeName="stroke-dashoffset"
          begin="1s"
          dur="0.2s"
          values="8;0"
        ></animate>
      </path>
    </g>
  </svg>
);
