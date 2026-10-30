import { useId, type ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface Props extends ComponentProps<"input"> {
  label?: string;
  caption?: string;
  icon?: LucideIcon;
}

export default function Input({
  icon: Icon,
  label,
  caption,
  id,
  className,
  ...props
}: Props) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-xs">
      {label && (
        <label htmlFor={inputId} className="text-label font-medium text-text">
          {label}
        </label>
      )}
      <div className="flex h-12 items-center gap-sm rounded-md border border-border bg-background px-md transition-colors hover:border-icon focus-within:border-icon focus-within:ring-2 focus-within:ring-icon/20">
        {Icon && (
          <Icon
            size={18}
            aria-hidden="true"
            className="shrink-0 text-primary"
          />
        )}
        <input
          {...props}
          id={inputId}
          className={twMerge(
            "h-full min-w-0 flex-1 border-0 bg-transparent text-text placeholder:text-text-muted focus:outline-none",
            className,
          )}
        />
      </div>
      {caption && <p className="text-caption text-text-muted">{caption}</p>}
    </div>
  );
}
