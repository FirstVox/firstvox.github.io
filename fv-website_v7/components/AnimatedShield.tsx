import React from 'react';

export const AnimatedShield: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
      </linearGradient>
      <filter id="shieldGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <style>
        {`
          .shield-group {
            transform-origin: center;
            animation: pulse 4s ease-in-out infinite;
          }
          .circuit-line {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
            animation: draw 3s ease-in-out infinite alternate;
            animation-delay: 0.5s;
          }
          .circuit-line-2 {
            stroke-dasharray: 150;
            stroke-dashoffset: -150;
            animation: draw-reverse 3.5s ease-in-out infinite alternate;
          }
          .check-mark {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: draw-check 1.5s ease-out forwards;
            animation-delay: 0.5s;
            opacity: 0;
          }
          @keyframes pulse {
            0% { transform: scale(0.98); }
            50% { transform: scale(1.02); }
            100% { transform: scale(0.98); }
          }
          @keyframes draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes draw-reverse {
            to { stroke-dashoffset: 0; }
          }
          @keyframes draw-check {
            50% { opacity: 1; }
            100% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
          }
        `}
      </style>
    </defs>
    
    <g className="shield-group" transform="scale(8.3) translate(2, 2)">
      {/* Base Shield */}
      <path 
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
        fill="url(#shieldGradient)" 
        filter="url(#shieldGlow)"
      />
      
      {/* Circuit lines inside shield */}
      <g stroke="#ffffff" strokeWidth="0.5" fill="none" strokeLinecap="round" opacity="0.6">
        <path className="circuit-line" d="M12 2.5 V 7 M12 11 V 17 M8 5 L12 7 L 16 5 M8 19 L12 17 L 16 19" />
        <path className="circuit-line-2" d="M4.5 7 L8 9 L8 15 L4.5 17 M19.5 7 L16 9 L16 15 L19.5 17" />
      </g>

      {/* Check mark */}
      <path 
        className="check-mark"
        d="m9 12 2 2 4-4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
