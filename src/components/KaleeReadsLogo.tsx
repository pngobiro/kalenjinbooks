export default function KaleeReadsLogo({ 
  size = 40, 
  className = '',
  showText = false,
  textSize = 'text-2xl'
}: { 
  size?: number; 
  className?: string;
  showText?: boolean;
  textSize?: string;
}) {
  // Just the flame/leaf icon
  const icon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      {/* Flame/leaf icon similar to AfriReads */}
      <path 
        d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14.5 12 15C14.5 14.5 16 12.5 16 10C16 6 12 2 12 2Z" 
        fill="#E07856"
      />
      <path 
        d="M12 5C12 5 10 7.5 10 10C10 11.5 10.8 12.8 12 13C13.2 12.8 14 11.5 14 10C14 7.5 12 5 12 5Z" 
        fill="#D4AF37"
      />
      <path 
        d="M12 8C12 8 11 9.5 11 11C11 11.8 11.4 12.4 12 12.5C12.6 12.4 13 11.8 13 11C13 9.5 12 8 12 8Z" 
        fill="#C85D3A"
      />
    </svg>
  );

  if (!showText) {
    return icon;
  }

  return (
    <div className="flex items-end">
      <span className={`font-bold text-neutral-brown-900 font-heading ${textSize}`}>
        Kalee
      </span>
      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none"
            width={16}
            height={16}
          >
            <path 
              d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14.5 12 15C14.5 14.5 16 12.5 16 10C16 6 12 2 12 2Z" 
              fill="#E07856"
            />
            <path 
              d="M12 5C12 5 10 7.5 10 10C10 11.5 10.8 12.8 12 13C13.2 12.8 14 11.5 14 10C14 7.5 12 5 12 5Z" 
              fill="#D4AF37"
            />
          </svg>
        </div>
        <span className={`font-bold text-primary font-heading ${textSize}`}>
          Reads
        </span>
      </div>
    </div>
  );
}

// Full logo with text for headers
export function KaleeReadsFullLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end ${className}`}>
      <span className="font-bold text-neutral-brown-900 font-heading text-2xl">
        Kalee
      </span>
      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none"
            width={16}
            height={16}
          >
            <path 
              d="M12 2C12 2 8 6 8 10C8 12.5 9.5 14.5 12 15C14.5 14.5 16 12.5 16 10C16 6 12 2 12 2Z" 
              fill="#E07856"
            />
            <path 
              d="M12 5C12 5 10 7.5 10 10C10 11.5 10.8 12.8 12 13C13.2 12.8 14 11.5 14 10C14 7.5 12 5 12 5Z" 
              fill="#D4AF37"
            />
          </svg>
        </div>
        <span className="font-bold text-primary font-heading text-2xl">
          Reads
        </span>
      </div>
    </div>
  );
}
