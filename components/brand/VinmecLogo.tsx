import Image from "next/image";

interface VinmecLogoProps {
  size?: number;
  /** Optional variant hint (reserved for future theming, not currently applied) */
  variant?: "light" | "dark" | string;
}

export function VinmecLogo({ size = 40 }: VinmecLogoProps) {
  return (
    <Image
      src="/logo_vinmec.png"
      alt="Vinmec Logo"
      height={size}
      width={size * 3}
      style={{ height: size, width: "auto" }}
      priority
    />
  );
}
