export default function KaleeReadsLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      {/* Kalenjin Gourd (Calabash) */}
      <ellipse cx="24" cy="28" rx="14" ry="16" fill="#E07856"/>
      <ellipse cx="24" cy="28" rx="12" ry="14" fill="#C85D3A"/>
      <ellipse cx="24" cy="12" rx="6" ry="8" fill="#E07856"/>
      <ellipse cx="24" cy="12" rx="4.5" ry="6" fill="#C85D3A"/>
      
      {/* Gourd neck connection */}
      <rect x="20" y="16" width="8" height="6" rx="2" fill="#E07856"/>
      
      {/* Decorative beads pattern on gourd */}
      <circle cx="16" cy="26" r="2" fill="#D4AF37"/>
      <circle cx="24" cy="24" r="2" fill="#8B9D83"/>
      <circle cx="32" cy="26" r="2" fill="#D4AF37"/>
      <circle cx="18" cy="32" r="2" fill="#8B9D83"/>
      <circle cx="24" cy="34" r="2" fill="#D4AF37"/>
      <circle cx="30" cy="32" r="2" fill="#8B9D83"/>
      
      {/* Bead string decoration at top */}
      <circle cx="18" cy="8" r="1.5" fill="#D4AF37"/>
      <circle cx="21" cy="6" r="1.5" fill="#8B9D83"/>
      <circle cx="24" cy="5" r="1.5" fill="#D4AF37"/>
      <circle cx="27" cy="6" r="1.5" fill="#8B9D83"/>
      <circle cx="30" cy="8" r="1.5" fill="#D4AF37"/>
      
      {/* Book pages emerging from gourd opening */}
      <path d="M20 10 L24 4 L28 10" stroke="#F5F1E8" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M21 9 L24 5 L27 9" stroke="#F5F1E8" strokeWidth="1" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
