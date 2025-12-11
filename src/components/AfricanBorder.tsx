export default function AfricanBorder({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg 
        viewBox="0 0 1200 24" 
        className="w-full h-6"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="africanPattern" x="0" y="0" width="60" height="24" patternUnits="userSpaceOnUse">
            {/* Zigzag pattern */}
            <path 
              d="M0 12 L10 4 L20 12 L30 4 L40 12 L50 4 L60 12" 
              stroke="#D4A574" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M0 12 L10 20 L20 12 L30 20 L40 12 L50 20 L60 12" 
              stroke="#D4A574" 
              strokeWidth="2" 
              fill="none"
            />
            {/* Small triangles */}
            <polygon points="10,8 15,12 10,12" fill="#C85D3A" opacity="0.6"/>
            <polygon points="30,8 35,12 30,12" fill="#C85D3A" opacity="0.6"/>
            <polygon points="50,8 55,12 50,12" fill="#C85D3A" opacity="0.6"/>
            <polygon points="20,12 25,16 20,16" fill="#8B9D83" opacity="0.6"/>
            <polygon points="40,12 45,16 40,16" fill="#8B9D83" opacity="0.6"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#africanPattern)" />
      </svg>
    </div>
  );
}

export function AfricanBorderThick({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg 
        viewBox="0 0 1200 40" 
        className="w-full h-10"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="africanPatternThick" x="0" y="0" width="80" height="40" patternUnits="userSpaceOnUse">
            {/* Top line */}
            <line x1="0" y1="4" x2="80" y2="4" stroke="#D4A574" strokeWidth="2"/>
            {/* Zigzag row 1 */}
            <path 
              d="M0 12 L10 8 L20 12 L30 8 L40 12 L50 8 L60 12 L70 8 L80 12" 
              stroke="#C85D3A" 
              strokeWidth="2" 
              fill="none"
            />
            {/* Diamond pattern middle */}
            <path 
              d="M0 20 L10 14 L20 20 L10 26 Z" 
              fill="#D4A574" 
              opacity="0.4"
            />
            <path 
              d="M20 20 L30 14 L40 20 L30 26 Z" 
              fill="#8B9D83" 
              opacity="0.4"
            />
            <path 
              d="M40 20 L50 14 L60 20 L50 26 Z" 
              fill="#D4A574" 
              opacity="0.4"
            />
            <path 
              d="M60 20 L70 14 L80 20 L70 26 Z" 
              fill="#8B9D83" 
              opacity="0.4"
            />
            {/* Zigzag row 2 */}
            <path 
              d="M0 28 L10 32 L20 28 L30 32 L40 28 L50 32 L60 28 L70 32 L80 28" 
              stroke="#C85D3A" 
              strokeWidth="2" 
              fill="none"
            />
            {/* Bottom line */}
            <line x1="0" y1="36" x2="80" y2="36" stroke="#D4A574" strokeWidth="2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#africanPatternThick)" />
      </svg>
    </div>
  );
}
