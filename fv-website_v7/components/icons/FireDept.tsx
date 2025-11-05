import React from 'react';

export const FireDept: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
    <path d="M3 7l9 5 9-5" />
    <path d="M12 22V12" />
    <path d="M3.5 8.5l-2 1" />
    <path d="M22.5 9.5l-2-1" />
    <path d="M4 17l-2-1" />
    <path d="M22 16l-2 1" />
  </svg>
);