import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";

const base =
  "inline-flex cursor-pointer items-center justify-center rounded-lg font-sans font-bold no-underline transition-colors duration-200 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-default disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-brand-50 hover:bg-brand-600",
  secondary:
    "border border-gray-300 bg-transparent text-gray-700 hover:border-brand-500 hover:text-brand-500",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  sm: "px-3.5 py-1.5 text-sm",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonProps = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;
type LinkButtonProps = CommonProps & { href: string };

/** The site's single button style: olive filled (primary) or outlined (secondary). Renders a link when given `href`. */
export function Button({ variant = "primary", size = "md", className, children, ...rest }: ButtonProps | LinkButtonProps) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className ?? ""}`;

  if (rest.href !== undefined) {
    return (
      <Link href={rest.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
