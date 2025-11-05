import React from 'react';

export const Plane: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M2 21h12l7-8-7-8H2l4 8-4 8z" />
    <path d="M2 21v-2l4-6-4-6V5h12l7 8-7 8H2z" />
  </svg>
);