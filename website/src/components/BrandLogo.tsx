import Image from "next/image"

interface BrandLogoProps {
  width?: number
  height?: number
  className?: string
}

export function BrandLogo({ width = 150, height = 40, className = "" }: BrandLogoProps) {
  return (
    <div className={`relative inline-block ${className}`} style={{ width, height }}>
      <Image 
        src="/logos/pomohub-logo-white.svg" 
        alt="PomoHub" 
        width={width}
        height={height}
        priority
        className="dark:hidden object-contain object-left"
        style={{ width: '100%', height: '100%' }}
      />
      <Image 
        src="/logos/pomohub-logo-black.svg" 
        alt="PomoHub" 
        width={width}
        height={height}
        priority
        className="hidden dark:block object-contain object-left"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
