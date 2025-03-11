import { ComponentProps, ReactNode } from "react";
import { cn } from "@/common/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { FlexCenter, FlexCol } from "@/common/components/flexbox";

const inputVariants = cva(
  "peer w-full font-medium text-primary py-2.5 border rounded-md border-gray-400 hover:border-gray-500",
  {
    variants: {
      error: {
        true: "border-red-300 hover:border-red-500 !outline-red-500 focus:text-primary",
      },
      startAdornment: {
        true: "pl-11",
      },
      endAdornment: {
        true: "pr-11",
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
  "text-sm font-semibold px-1 mb-1 text-primary group-hover:text-gray-500 peer-focus:text-tertiary select-none order-first",
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

const adornmentVariants = cva(
  "absolute z-10 mx-3 top-6 bottom-0 text-gray-400 group-hover:text-gray-500 peer-focus:text-tertiary",
  {
    variants: {
      error: {
        true: "group-hover:text-red-500 peer-focus:text-red-500",
      },
      size: {
        sm: "h-10 w-6",
        md: "h-12 w-6",
        lg: "h-14 w-6",
      },
    },
    defaultVariants: {
      size: "md",
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
  slotClassNames?: {
    input?: string;
    label?: string;
    helperText?: string;
    adornment?: {
      start?: string;
      end?: string;
    };
  };
  error?: boolean;
  helperText?: string;
}

export default function TextField({
  label,
  id,
  size = "md",
  startAdornment,
  endAdornment,
  slotClassNames,
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
            inputVariants({
              size,
              error,
              startAdornment: Boolean(startAdornment),
              endAdornment: Boolean(endAdornment),
            }),
            "placeholder:text-gray-400",
            "focus:outline-tertiary focus:text-primary",
            "disabled:outline-0 disabled:pointer-events-none disabled:border-gray-400 disabled:hover:border-gray-400 disabled:text-gray-400 disabled:focus:text-gray-400",
            slotClassNames?.input
          )}
        />

        {label ? (
          <label
            htmlFor={id}
            className={cn(
              labelVariants({
                error,
                required,
              }),
              "peer-disabled:pointer-events-none peer-disabled:border-gray-300 peer-disabled:hover:border-gray-300 peer-disabled:text-gray-400 peer-disabled:group-hover:text-gray-400 peer-disabled:peer-focus:text-gray-400",
              "peer-read-only:pointer-events-none peer-read-only:border-gray-500 peer-read-only:hover:border-gray-500 peer-read-only:text-gray-400 peer-read-only:group-hover:text-gray-500 peer-read-only:peer-focus:text-tertiary",
              slotClassNames?.label
            )}
          >
            {label}
          </label>
        ) : null}

        {helperText && (
          <p
            className={cn(
              "mt-1 ml-1 text-xs font-medium h-4 text-gray-500 peer-disabled:text-gray-400",
              error && "text-red-500",
              slotClassNames?.helperText
            )}
          >
            {helperText}
          </p>
        )}

        {startAdornment ? (
          <FlexCenter
            className={cn(
              adornmentVariants({ size, error }),
              "left-0",
              slotClassNames?.adornment?.start
            )}
          >
            {startAdornment}
          </FlexCenter>
        ) : null}

        {endAdornment ? (
          <FlexCenter
            className={cn(
              adornmentVariants({
                size,
                error,
                className: slotClassNames?.adornment?.end,
              }),
              "right-0"
            )}
          >
            {endAdornment}
          </FlexCenter>
        ) : null}
      </FlexCol>
    </div>
  );
}
