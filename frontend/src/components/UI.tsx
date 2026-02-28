import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark';
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ className, variant = 'light', hover = true, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        variant === 'light' ? "glass" : "glass-dark",
        hover && "hover:scale-[1.02] hover:shadow-primary-mid/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const GradientButton = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "gradient-bg px-6 py-3 rounded-xl font-medium text-white shadow-lg shadow-primary-mid/30 hover:shadow-primary-mid/50 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-medium text-white transition-all border border-white/10 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-white/5", className)}
      {...props}
    />
  );
};
