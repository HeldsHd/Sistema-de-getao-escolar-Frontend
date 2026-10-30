import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";


interface Props extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({ variant = "primary", ...props }: Props) {
  return (
    <button
      {...props}
      className={twMerge(
        "py-sm px-lg rounded-md text-body font-body disabled:cursor-not-allowed bg-primary-soft text-white hover:bg-primary hover:text-surface disabled:bg-primary/50 disabled:text-surface/50",
        variant === "primary" && "bg-primary text-surface hover:bg-primary/90",
        variant === "secondary" &&
          "bg-background text-black border-2 border-primary hover:bg-primary hover:text-surface",
        variant === "danger" && "bg-error text-surface",
        variant === "ghost" &&
          "bg-transparent text-primary hover:bg-primary hover:text-surface",
        props.className,
      )}
    />
  );
}
