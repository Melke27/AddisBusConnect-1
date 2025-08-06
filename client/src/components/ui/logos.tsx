import React from 'react';

// Ethiopian flag colors: Green (#009639), Yellow (#FFDE00), Red (#DA020E)
// Anbessa (Lion) Bus Company Logo
export const AnbessaLogo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Ethiopian flag background */}
    <rect width="100" height="33.33" fill="#009639" />
    <rect y="33.33" width="100" height="33.33" fill="#FFDE00" />
    <rect y="66.66" width="100" height="33.33" fill="#DA020E" />
    
    {/* Lion silhouette */}
    <g fill="#000" opacity="0.8">
      {/* Lion body */}
      <ellipse cx="50" cy="60" rx="25" ry="15" />
      {/* Lion head */}
      <circle cx="50" cy="35" r="18" />
      {/* Lion mane */}
      <circle cx="50" cy="35" r="22" fill="#8B4513" opacity="0.6" />
      {/* Lion legs */}
      <rect x="35" y="70" width="6" height="15" />
      <rect x="45" y="70" width="6" height="15" />
      <rect x="55" y="70" width="6" height="15" />
      <rect x="65" y="70" width="6" height="15" />
      {/* Lion tail */}
      <ellipse cx="75" cy="55" rx="8" ry="3" />
    </g>
    
    {/* Company name */}
    <text x="50" y="92" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="bold">
      ANBESSA
    </text>
  </svg>
);

// Sheger Bus Company Logo
export const ShegerLogo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Ethiopian flag background circles */}
    <circle cx="50" cy="50" r="45" fill="#009639" />
    <circle cx="50" cy="50" r="30" fill="#FFDE00" />
    <circle cx="50" cy="50" r="15" fill="#DA020E" />
    
    {/* Ethiopian star */}
    <g fill="#fff">
      <polygon points="50,25 52,35 62,35 54,42 57,52 50,45 43,52 46,42 38,35 48,35" />
    </g>
    
    {/* Bus silhouette */}
    <g fill="#000" opacity="0.7">
      {/* Bus body */}
      <rect x="25" y="55" width="50" height="20" rx="3" />
      {/* Bus windows */}
      <rect x="30" y="58" width="8" height="6" fill="#87CEEB" />
      <rect x="40" y="58" width="8" height="6" fill="#87CEEB" />
      <rect x="50" y="58" width="8" height="6" fill="#87CEEB" />
      <rect x="60" y="58" width="8" height="6" fill="#87CEEB" />
      {/* Bus wheels */}
      <circle cx="35" cy="78" r="4" />
      <circle cx="65" cy="78" r="4" />
    </g>
    
    {/* Company name */}
    <text x="50" y="92" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="bold">
      SHEGER
    </text>
  </svg>
);

// Combined Logo for the App
export const AddisBusLogo: React.FC<{ className?: string }> = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 120 100" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Ethiopian flag background */}
    <rect width="120" height="33.33" fill="#009639" />
    <rect y="33.33" width="120" height="33.33" fill="#FFDE00" />
    <rect y="66.66" width="120" height="33.33" fill="#DA020E" />
    
    {/* Central Ethiopian star */}
    <g fill="#fff">
      <polygon points="60,20 63,30 73,30 65,37 68,47 60,40 52,47 55,37 47,30 57,30" />
    </g>
    
    {/* Modern bus design */}
    <g fill="#000" opacity="0.8">
      {/* Bus body */}
      <rect x="20" y="50" width="80" height="25" rx="5" />
      {/* Bus front */}
      <rect x="15" y="55" width="10" height="15" rx="3" />
      {/* Bus windows */}
      <rect x="25" y="53" width="12" height="8" fill="#87CEEB" />
      <rect x="40" y="53" width="12" height="8" fill="#87CEEB" />
      <rect x="55" y="53" width="12" height="8" fill="#87CEEB" />
      <rect x="70" y="53" width="12" height="8" fill="#87CEEB" />
      <rect x="85" y="53" width="12" height="8" fill="#87CEEB" />
      {/* Bus wheels */}
      <circle cx="35" cy="78" r="5" fill="#333" />
      <circle cx="85" cy="78" r="5" fill="#333" />
      <circle cx="35" cy="78" r="3" fill="#666" />
      <circle cx="85" cy="78" r="3" fill="#666" />
      {/* Bus door */}
      <rect x="45" y="62" width="8" height="13" fill="#4A90E2" />
    </g>
    
    {/* App name */}
    <text x="60" y="95" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold">
      AddisBus Connect
    </text>
  </svg>
);