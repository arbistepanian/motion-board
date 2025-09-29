import Label from "./Label";
import { forwardRef } from "react";
import { cn } from "@/app/lib/utils/utils";

interface InputType extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
}

const Textbox = forwardRef<HTMLInputElement, InputType>(
    ({ className, label, helperText, ...props }, ref) => {
        return (
            <div className="flex w-full flex-col justify-start items-start gap-1">
                {label && <Label>{label}</Label>}
                <input
                    ref={ref}
                    className={cn("textbox", className)}
                    {...props}
                />
                {helperText && (
                    <p className="text-sm text-[var(--color-subtext)]">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textbox.displayName = "Textbox";
export default Textbox;
