// ProfileShell.tsx
import { ReactNode } from "react";

interface ProfileShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  containerWidth?: "md" | "lg" | "xl";
}

export default function ProfileShell({
  title,
  subtitle,
  children,
  containerWidth = "lg"
}: ProfileShellProps) {

  const widthMap = {
    md: "max-w-3xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl"
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea]">

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#1f2f57] to-[#2e4379] pt-32 pb-20 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16">
        <div className={`mx-auto px-6 ${widthMap[containerWidth]}`}>
          {children}
        </div>
      </section>

    </div>
  );
}