import React from "react";
import { cn } from "../lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  variant?: "light" | "dark";
}

export default function Logo({ className, size, variant = "light" }: LogoProps) {
  // Using the specific URL provided by the user as primary
  const logoUrl = "https://www.image2url.com/r2/default/images/1777888491900-014add4d-3757-4bfe-ae4e-fbe9f6bc2ca4.png";
  const fallbackUrl = "/logo.png";

  return (
    <div 
      className={cn("inline-flex items-center justify-center shrink-0", className)} 
      style={size ? { width: size, height: size } : undefined}
    >
      <img 
        src={logoUrl} 
        alt="IHRF Logo" 
        className="w-full h-full object-contain filter drop-shadow-sm transition-opacity duration-300"
        referrerPolicy="no-referrer"
        loading="eager"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== fallbackUrl) {
            console.warn("External logo failed, trying local fallback...");
            target.src = fallbackUrl;
          } else {
            console.error("All logo image sources failed to load.");
            target.style.opacity = "0";
          }
        }}
      />
    </div>
  );
}
