import type { ButtonHTMLAttributes } from "react";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "link" };
export function Button({ className = "", type = "button", variant = "primary", ...props }: Props) {
  const tone = variant === "primary" ? "" : ` button--${variant}`;
  return <button className={`button${tone} ${className}`.trim()} type={type} {...props} />;
}
