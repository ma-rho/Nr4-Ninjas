import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center transition-opacity hover:opacity-80"
      aria-label="NR4 NINJAS Home"
    >
      <svg
        viewBox="0 20 100 60"
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-auto"
      >
        <g className="text-foreground">
          <path
            d="M55.7,53.3c0-12.8-10.5-23.3-23.3-23.3S8.1,40.5,8.1,53.3c0,12.8,10.5,23.3,23.3,23.3S55.7,66.1,55.7,53.3z"
            fill="currentColor"
          />
          <path
            d="M33.6,30.3c0,0-2.4-11.8-13.9-6.3c-5.7,2.7-5,11.8-5,11.8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            strokeWidth="5"
          />
          <path
            d="M37.6,24.4c0,0-0.4-11.5-9.9-12.7s-13,4.6-13,4.6"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            strokeWidth="5"
          />
          <path d="M18,48 C22,44 28,44 32,48 C28,52 22,52 18,48" fill="white" />
          <circle cx="25" cy="48" r="1.5" fill="black" />
        </g>
        <g className="text-primary">
          <path
            d="M93,73.3c0-12.8-10.5-23.3-23.3-23.3s-23.3,10.5-23.3,23.3c0,12.8,10.5,23.3,23.3,23.3S93,86.1,93,73.3z"
            fill="currentColor"
          />
          <path
            d="M70.9,50.3c0,0-2.4-11.8-13.9-6.3c-5.7,2.7-5,11.8-5,11.8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            strokeWidth="5"
          />
          <path
            d="M74.9,44.4c0,0-0.4-11.5-9.9-12.7S52,36.3,52,36.3"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            strokeWidth="5"
          />
          <path d="M56,69 C60,65 66,65 70,69 C66,73 60,73 56,69" fill="white" />
          <polygon
            points="65.9,69.5 64.5,70.9 63.2,69.5 61.8,70.9 60.5,69.5 61.8,68.2 60.5,66.8 61.8,65.5 63.2,66.8 64.5,65.5 65.9,66.8 64.5,68.2"
            fill="currentColor"
          />
        </g>
      </svg>
    </Link>
  );
}
