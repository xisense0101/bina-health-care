export function Logo() {
  return (
    <svg
      viewBox="0 0 60 60"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Circular background */}
      <circle cx="30" cy="30" r="28" fill="#5B9A9E" opacity="0.1" />
      
      {/* Heart with hands icon representing care */}
      <g transform="translate(30, 30)">
        {/* Heart */}
        <path
          d="M0,3 C-3,-3 -9,-3 -9,3 C-9,9 0,15 0,15 C0,15 9,9 9,3 C9,-3 3,-3 0,3 Z"
          fill="#5B9A9E"
        />
        {/* Supporting hands/care symbol */}
        <path
          d="M-12,8 Q-10,12 -6,13 M12,8 Q10,12 6,13"
          stroke="#E5D4C1"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
