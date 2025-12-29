import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  iconOnly?: boolean;
}

export function BrandLogo({ className, width = 24, height = 24, iconOnly = false }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center rounded-lg shadow-sm">
        <img 
            src="/logos/pomohub-app-logo.svg" 
            alt="PomoHub Logo" 
            width={width} 
            height={height} 
            className="w-full h-full object-contain"
            style={{ width, height }}
        />
      </div>
      {!iconOnly && (
        <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
            PomoHub
        </span>
      )}
    </div>
  );
}
