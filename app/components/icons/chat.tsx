export const ChatsOutlinedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 28 28"
    {...props}
  >
    <path
      fill="currentColor"
      d="M3.5 12a7.5 7.5 0 1 1 3.91 6.586a.75.75 0 0 0-.555-.066l-3.25.87l.872-3.252a.75.75 0 0 0-.066-.553A7.46 7.46 0 0 1 3.5 12M11 3a9 9 0 0 0-8.048 13.032l-.908 3.389a1.25 1.25 0 0 0 1.53 1.53l3.387-.906A9 9 0 1 0 11 3m6 22a8.98 8.98 0 0 1-6.732-3.026a10 10 0 0 0 2.109-.068A7.47 7.47 0 0 0 17 23.5a7.46 7.46 0 0 0 3.59-.914a.75.75 0 0 1 .555-.066l3.25.87l-.872-3.252a.75.75 0 0 1 .066-.553A7.5 7.5 0 0 0 24.5 16a7.5 7.5 0 0 0-3.825-6.54a10 10 0 0 0-.75-1.974a9.004 9.004 0 0 1 5.123 12.547l.908 3.388a1.25 1.25 0 0 1-1.531 1.53l-3.386-.906A9 9 0 0 1 17 25m-5-8.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M9.5 9.257l.002-.032a1.5 1.5 0 0 1 .183-.606C9.837 8.348 10.153 8 11 8s1.163.348 1.315.618a1.5 1.5 0 0 1 .185.635v.003c-.002.522-.305.858-.914 1.534l-.018.021c-.58.643-1.318 1.514-1.318 2.939a.75.75 0 0 0 1.5 0c0-.825.386-1.329.932-1.935l.125-.137C13.308 11.13 14 10.374 14 9.25v-.002l-.001-.049l-.006-.095a3 3 0 0 0-.37-1.222C13.211 7.152 12.402 6.5 11 6.5s-2.212.652-2.622 1.382A3 3 0 0 0 8 9.231v.019a.75.75 0 0 0 1.5.007"
    />
  </svg>
);

export const RobotOutlinedIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M13.5 2c0 .444-.193.843-.5 1.118V5h5a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h5V3.118A1.5 1.5 0 1 1 13.5 2M6 7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-4 3H0v6h2zm20 0h2v6h-2zM9 14.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m6 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"
    ></path>
  </svg>
);

export const ThreeDotsBounceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle cx={4} cy={12} r={3} fill="currentColor">
      <animate
        id="svgSpinners3DotsBounce0"
        attributeName="cy"
        begin="0;svgSpinners3DotsBounce1.end+0.25s"
        calcMode="spline"
        dur="0.6s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      ></animate>
    </circle>
    <circle cx={12} cy={12} r={3} fill="currentColor">
      <animate
        attributeName="cy"
        begin="svgSpinners3DotsBounce0.begin+0.1s"
        calcMode="spline"
        dur="0.6s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      ></animate>
    </circle>
    <circle cx={20} cy={12} r={3} fill="currentColor">
      <animate
        id="svgSpinners3DotsBounce1"
        attributeName="cy"
        begin="svgSpinners3DotsBounce0.begin+0.2s"
        calcMode="spline"
        dur="0.6s"
        keySplines=".33,.66,.66,1;.33,0,.66,.33"
        values="12;6;12"
      ></animate>
    </circle>
  </svg>
);
