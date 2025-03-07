import { ComponentProps, ReactNode } from "react";
import { cn } from "@/common/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { FlexCol } from "@/common/components/flexbox";

const inputVariants = cva(
  "peer w-full text-base font-medium text-primary py-2.5 border rounded-md border-gray-400 hover:border-gray-500",
  {
    variants: {
      error: {
        true: "border-red-300 hover:border-red-500 !outline-red-500 focus:text-primary",
      },
      size: {
        sm: "py-1.5 h-10 px-2 text-sm",
        md: "py-2.5 h-12 px-3 text-base",
        lg: "py-3 h-14 px-4 text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const labelVariants = cva(
  "text-sm font-semibold px-1 mb-1 text-gray-400 group-hover:text-gray-500 peer-focus:text-tertiary select-none order-first",
  {
    variants: {
      error: {
        true: "border-red-300 group-hover:border-red-500 group-hover:text-red-500 peer-focus:text-red-500",
      },
      required: {
        true: "after:content-['*'] after:ml-1 after:text-sm after:text-red-500",
      },
    },
  }
);

interface TextFieldProps
  extends Omit<ComponentProps<"input">, "className" | "size"> {
  label?: string;
  id: string;
  name: string;
  type: "text" | "email" | "number" | "password" | "tel";
  size?: "sm" | "md" | "lg";
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
  size = "md",
  floatingLabel = false,
  startAdornment,
  endAdornment,
  slotProps,
  helperText,
  error,
  disabled,
  readOnly,
  required,
  ...props
}: TextFieldProps & VariantProps<typeof inputVariants>) {
  return (
    <div className="w-full">
      <FlexCol className="relative group w-full">
        <input
          {...props}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={cn(
            inputVariants({ size, error }),
            "placeholder:text-gray-400",
            "focus:outline-tertiary focus:text-primary",
            "disabled:outline-0 disabled:pointer-events-none disabled:border-gray-400 disabled:hover:border-gray-400 disabled:text-gray-400 disabled:focus:text-gray-400",
            "read-only:outline-0 read-only:pointer-events-none read-only:border-gray-400 read-only:hover:border-gray-400 read-only:text-primary read-only:focus:text-primary"
          )}
        />

        {label && !floatingLabel ? (
          <label
            htmlFor={id}
            className={cn(
              labelVariants({ error, required }),
              "peer-disabled:outline-0 peer-disabled:pointer-events-none peer-disabled:border-gray-300 peer-disabled:hover:border-gray-300 peer-disabled:text-gray-400 peer-disabled:group-hover:text-gray-400 peer-disabled:peer-focus:text-gray-400",
              "peer-read-only:outline-0 peer-read-only:pointer-events-none peer-read-only:border-gray-500 peer-read-only:hover:border-gray-500 peer-read-only:text-gray-400 peer-read-only:group-hover:text-gray-400 peer-read-only:peer-focus:text-gray-400"
            )}
          >
            {label}
          </label>
        ) : null}

        {helperText && (
          <p
            className={cn(
              "mt-1 ml-1 text-xs font-medium h-4 text-gray-500 peer-disabled:text-gray-400",
              error && "text-red-500"
            )}
          >
            {helperText}
          </p>
        )}

        {/* {startAdornment}
        {endAdornment}

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
        )} */}
      </FlexCol>
    </div>
  );
}
