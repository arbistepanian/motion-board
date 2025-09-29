import { ReactNode } from "react";
import { cn } from "@/app/lib/utils/utils";
import Tooltip from "./Tooltip";
import { IconType } from "@/app/lib/types/types";
import Icon from "./Icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variation?: "icon" | "primary" | "secondary" | "ghost" | "danger";
    iconClasses?: string;
    tooltip?: string;
    showIconAfter?: boolean;
    icon?: IconType;
    loading?: boolean;
}

export default function Button({
    children,
    type = "button",
    className,
    iconClasses,
    variation = "primary",
    tooltip,
    icon,
    showIconAfter = false,
    loading = false,
    ...props
}: ButtonProps) {
    const variationClass = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        danger: "btn-danger",
        icon: "", // Icons are styled differently
    }[variation];

    const buttonClass = cn("btn", variationClass, className);

    const iconColorClass =
        variation === "primary"
            ? "text-[var(--color-on-primary)]"
            : variation == "ghost"
            ? "text-[var(--color-text)]"
            : "text-[var(--color-text)]";

    const iconClass = cn("w-5 h-5", iconColorClass, iconClasses);

    let iconNode: ReactNode | null = null;

    if (loading && icon) {
        iconNode = <span className={cn("spinner w-5 h-5", iconColorClass)} />;
    } else if (icon) {
        // const IconMap: Record<
        //     NonNullable<ButtonProps["icon"]>,
        //     React.ReactNode
        // > = {
        //     add: <PlusIcon className={iconClass} />,
        //     edit: <PencilSquareIcon className={iconClass} />,
        //     delete: <TrashIcon className={iconClass} />,
        //     save: <CheckCircleIcon className={iconClass} />,
        //     cancel: <XMarkIcon className={iconClass} />,
        //     signup: <UserPlusIcon className={iconClass} />,
        //     signin: <ArrowRightEndOnRectangleIcon className={iconClass} />,
        //     signout: <ArrowLeftStartOnRectangleIcon className={iconClass} />,
        //     ai: <SparklesIcon className={iconClass} />,
        //     send: <PaperAirplaneIcon className={iconClass} />,
        //     chat: <ChatBubbleBottomCenterTextIcon className={iconClass} />,
        //     arrowDown: <ArrowDownIcon className={iconClass} />,
        //     arrowUp: <ArrowUpIcon className={iconClass} />,
        //     arrowLeft: <ArrowLeftIcon className={iconClass} />,
        //     arrowRight: <ArrowRightIcon className={iconClass} />,
        //     reset: <ArrowPathIcon className={iconClass} />,
        //     undo: <ArrowUturnLeftIcon className={iconClass} />,
        //     redo: <ArrowUturnRightIcon className={iconClass} />,
        //     chevronLeft: <ChevronLeftIcon className={iconClass} />,
        //     chevronRight: <ChevronRightIcon className={iconClass} />,
        //     X: <XMarkIcon className={iconClass} />,
        //     search: <MagnifyingGlassIcon className={iconClass} />,
        //     portfolio: <BriefcaseIcon className={iconClass} />,
        //     preview: <EyeIcon className={iconClass} />,
        //     swatch: <SwatchIcon className={iconClass} />,
        //     upload: <CloudArrowUpIcon className={iconClass} />,
        //     creditcard: <CreditCardIcon className={iconClass} />,
        //     star: <StarIcon className={iconClass} />,
        //     "star-solid": <StarSolidIcon className={iconClass} />,
        //     job: <DocumentTextIcon className={iconClass} />,
        // };

        iconNode = <Icon size={5} icon={icon} className={iconClass} />;
    }

    const buttonNode = showIconAfter ? (
        <button type={type} className={buttonClass} {...props}>
            {children}
            {iconNode}
        </button>
    ) : (
        <button type={type} className={buttonClass} {...props}>
            {iconNode}
            {children}
        </button>
    );

    return tooltip ? (
        <Tooltip content={tooltip}>{buttonNode}</Tooltip>
    ) : (
        buttonNode
    );
}
