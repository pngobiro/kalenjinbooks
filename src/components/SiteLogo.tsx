export default function SiteLogo({ 
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
  // Mama Africa Library emblem: maternal embrace cradling an open book
  // with the African continent rising above — generated brand mark
  const icon = (
    <img
      src="/images/logo.png"
      alt="Mama Africa Library"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );

  if (!showText) {
    return icon;
  }

  return (
    <div className="flex items-end">
      <span className={`font-bold text-neutral-brown-900 font-heading ${textSize}`}>
        Mama Africa
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
          Library
        </span>
      </div>
    </div>
  );
}

// Full logo with text for headers
export function SiteFullLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end ${className}`}>
      <span className="font-bold text-neutral-brown-900 font-heading text-2xl">
        Mama Africa
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
          Library
        </span>
      </div>
    </div>
  );
}
