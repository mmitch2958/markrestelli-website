import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  isDarkBg?: boolean;
}

export function Logo({ className, isDarkBg = false }: LogoProps) {
  // If we are on a dark background (Hero), use white/currentColor.
  // If we are on a light background (scrolled navbar or footer), use Gold and Black.
  
  const roofColor = isDarkBg ? "currentColor" : "currentColor"; // Will be black if parent is black
  const nameColor = isDarkBg ? "currentColor" : "currentColor";
  const titleColor = isDarkBg ? "currentColor" : "hsl(45 40% 50%)"; // Gold for Realtor when on light bg

  return (
    <div className={cn("flex flex-col items-center justify-center relative", className)}>
      <svg 
        width="300" 
        height="100" 
        viewBox="0 0 300 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Roof Line - Matches Text Color (Black/White) */}
        <path 
          d="M20 50 L150 10 L220 30 L220 20 L240 20 L240 37 L280 50" 
          stroke={roofColor}
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-colors duration-300"
        />
        
        {/* Text: Mark Restelli - Matches Text Color (Black/White) */}
        <text 
          x="150" 
          y="90" 
          textAnchor="middle" 
          fill={nameColor}
          fontFamily="'Great Vibes', cursive" 
          fontSize="64"
          className="transition-colors duration-300"
        >
          Mark Restelli
        </text>

        {/* Text: REALTOR - Gold when on light background */}
        <text 
          x="210" 
          y="110" 
          textAnchor="middle" 
          fill={titleColor}
          fontFamily="'Lato', sans-serif" 
          fontSize="14" 
          fontWeight="700" 
          letterSpacing="0.2em"
          className="transition-colors duration-300 uppercase"
        >
          Realtor
        </text>
      </svg>
    </div>
  );
}
