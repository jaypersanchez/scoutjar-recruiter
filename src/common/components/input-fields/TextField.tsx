import { ComponentProps, ReactElement, ReactNode } from "react";
import { cn } from "@/common/lib/utils";
import { FlexCol } from "@/common/components/flexbox";

interface TextFieldProps extends Omit<ComponentProps<"input">, "className"> {
  label?: string;
  id: string;
  name: string;
  type: "text" | "email" | "number" | "password" | "tel";
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  slotProps?: {
    input?: string;
    label?: string;
  };
  error?: boolean;
  helperText?: string;
  floatingLabel?: boolean;
}

export default function TextField({
  label,
  id,
  slotProps,
  helperText,
  floatingLabel = false,
  ...props
}: TextFieldProps): ReactElement {
  return (
    <div className="w-full">
      <FlexCol className="relative group">
        <input
          {...props}
          id={id}
          className={cn(
            "relative w-full text-base bg-transparent rounded-sm appearance-none focus:outline-none focus:ring-0 border shadow-sm peer select-none text-gray-500 placeholder:text-gray-400 focus:text-gray-900 group-hover:text-gray-900",
            "read-only:cursor-default read-only:select-none read-only:!border-gray-400 read-only:!text-gray-400",
            "disabled:cursor-default disabled:group-hover:border-gray-400 disabled:border-gray-400 disabled:!text-gray-400",
            "py-2.5 h-14 px-3.5",
            props.error
              ? "border-red-500 group-hover:border-red-400"
              : "border-gray-400 group-hover:border-gray-900 focus:border-gray-600"
          )}
        />

        {floatingLabel && (
          <label
            htmlFor={id}
            className={cn(
              "absolute text-gray-500 text-base font-semibold duration-300 -translate-y-3.5 scale-90 top-1 z-20 origin-[0] bg-white px-2 group-hover:text-gray-900 select-none left-3",
              "peer-focus:px-2 peer-focus:text-gray-900 peer-focus:-translate-y-3.5 peer-focus:top-1 peer-focus:scale-90",
              "peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2",
              "peer-read-only:text-gray-500 leading-none",
              "peer-disabled:-translate-y-3.5 peer-disabled:scale-90 peer-disabled:top-1",
              "peer-read-only:-translate-y-3.5 peer-read-only:scale-90 peer-read-only:top-1 peer-read-only:!text-gray-500",
              props.error
                ? "text-red-600 group-hover:text-red-500"
                : props.disabled && "text-gray-400 group-hover:text-gray-400",
              props.required &&
                "after:content-['*'] after:ml-1 after:text-sm after:text-red-500"
            )}
          >
            {label}
          </label>
        )}

        {label && !floatingLabel ? (
          <label
            htmlFor={id}
            className={cn(
              "text-gray-500 font-semibold px-1 peer-focus:text-gray-900 select-none group-hover:text-gray-900 peer-read-only:text-gray-500 mb-1 order-first",
              "peer-read-only:!text-gray-500",
              props.error
                ? "text-red-600 group-hover:text-red-500"
                : props.disabled && "text-gray-400 group-hover:text-gray-500",
              props.required &&
                "after:content-['*'] after:ml-1 after:text-sm after:text-red-600"
            )}
          >
            {label}
          </label>
        ) : null}
      </FlexCol>

      {helperText && (
        <p
          className={cn(
            "mt-1 ml-1 text-xs font-medium h-4",
            props.error ? "text-red-500" : "text-gray-500",
            props.error ?? helperText ? "visible" : "invisible"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
