import { cn } from "@/app/lib/utils/utils";

export default function Label({
    children,
    className,
    ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label className={cn("label", className)} {...props}>
            {children}
        </label>
    );
}
