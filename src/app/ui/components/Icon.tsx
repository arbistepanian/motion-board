import type { IconType } from "@/app/lib/types/types";
import { cn } from "@/app/lib/utils/utils";
import { SocialIcons } from "@/app/ui/components/SocialIcons";

import {
    MagnifyingGlassIcon,
    BriefcaseIcon,
    Bars3Icon,
    Cog6ToothIcon,
    ArrowPathIcon,
    SparklesIcon,
    DocumentTextIcon,
    SwatchIcon,
    StarIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    XMarkIcon,
    UserPlusIcon,
    ArrowRightEndOnRectangleIcon,
    ArrowLeftStartOnRectangleIcon,
    PaperAirplaneIcon,
    ChatBubbleBottomCenterTextIcon,
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    CloudArrowUpIcon,
    CreditCardIcon,
    DevicePhoneMobileIcon,
    ChartBarSquareIcon,
    MagnifyingGlassCircleIcon,
    CpuChipIcon,
    GlobeAltIcon,
    CheckIcon,
} from "@heroicons/react/24/outline";

import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    isSelected?: boolean;
    icon?: IconType;
    size?: number;
    className?: string;
}

export default function Icon({
    icon,
    size = 6,
    isSelected,
    className,
}: IconProps) {
    const baseClassNames = `inline-block w-${size} h-${size} ${
        isSelected
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text)] group-hover:text-[var(--color-text-hover)]"
    }`;

    const props = {
        className: cn(baseClassNames, className),
        // fill: "currentColor",
        // viewBox: "0 0 24 24",
        // xmlns: "http://www.w3.org/2000/svg",
    };

    switch (icon) {
        case "portfolio":
            return (
                <BriefcaseIcon className={cn([baseClassNames, className])} />
            );
        case "menu":
            return <Bars3Icon className={cn([baseClassNames, className])} />;
        case "search":
            return (
                <MagnifyingGlassIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "settings":
            return (
                <Cog6ToothIcon className={cn([baseClassNames, className])} />
            );
        case "reset":
            return (
                <ArrowPathIcon className={cn([baseClassNames, className])} />
            );
        case "ai":
            return <SparklesIcon className={cn([baseClassNames, className])} />;
        case "job":
            return (
                <DocumentTextIcon className={cn([baseClassNames, className])} />
            );
        case "swatch":
            return <SwatchIcon className={cn([baseClassNames, className])} />;
        case "email":
            return SocialIcons.EmailIcon(props);
        case "phone":
            return SocialIcons.PhoneIcon(props);
        case "web":
            return SocialIcons.WebIcon(props);
        // Social icons
        case "facebook":
            return SocialIcons.FacebookIcon(props);
        case "instagram":
            return SocialIcons.InstagramIcon(props);
        case "linkedIn":
            return SocialIcons.LinkedInIcon(props);
        case "github":
            return SocialIcons.GitHubIcon(props);
        case "twitter":
            return SocialIcons.TwitterIcon(props);
        case "star":
            return <StarIcon className={cn([baseClassNames, className])} />;
        case "star-solid":
            return (
                <StarSolidIcon className={cn([baseClassNames, className])} />
            );
        case "add":
            return <PlusIcon className={cn([baseClassNames, className])} />;
        case "edit":
            return (
                <PencilSquareIcon className={cn([baseClassNames, className])} />
            );
        case "delete":
            return <TrashIcon className={cn([baseClassNames, className])} />;
        case "save":
            return (
                <CheckCircleIcon className={cn([baseClassNames, className])} />
            );
        case "cancel":
            return <XMarkIcon className={cn([baseClassNames, className])} />;
        case "signup":
            return <UserPlusIcon className={cn([baseClassNames, className])} />;
        case "signin":
            return (
                <ArrowRightEndOnRectangleIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "signout":
            return (
                <ArrowLeftStartOnRectangleIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "ai":
            return <SparklesIcon className={cn([baseClassNames, className])} />;
        case "send":
            return (
                <PaperAirplaneIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "chat":
            return (
                <ChatBubbleBottomCenterTextIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "arrowDown":
            return (
                <ArrowDownIcon className={cn([baseClassNames, className])} />
            );
        case "arrowUp":
            return <ArrowUpIcon className={cn([baseClassNames, className])} />;
        case "arrowLeft":
            return (
                <ArrowLeftIcon className={cn([baseClassNames, className])} />
            );
        case "arrowRight":
            return (
                <ArrowRightIcon className={cn([baseClassNames, className])} />
            );
        case "reset":
            return (
                <ArrowPathIcon className={cn([baseClassNames, className])} />
            );
        case "undo":
            return (
                <ArrowUturnLeftIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "redo":
            return (
                <ArrowUturnRightIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "chevronLeft":
            return (
                <ChevronLeftIcon className={cn([baseClassNames, className])} />
            );
        case "chevronRight":
            return (
                <ChevronRightIcon className={cn([baseClassNames, className])} />
            );
        case "X":
            return <XMarkIcon className={cn([baseClassNames, className])} />;
        case "search":
            return (
                <MagnifyingGlassIcon
                    className={cn([baseClassNames, className])}
                />
            );
        case "portfolio":
            return (
                <BriefcaseIcon className={cn([baseClassNames, className])} />
            );
        case "preview":
            return <EyeIcon className={cn([baseClassNames, className])} />;
        case "swatch":
            return <SwatchIcon className={cn([baseClassNames, className])} />;
        case "upload":
            return (
                <CloudArrowUpIcon className={cn([baseClassNames, className])} />
            );
        case "creditcard":
            return (
                <CreditCardIcon className={cn([baseClassNames, className])} />
            );
        case "star":
            return <StarIcon className={cn([baseClassNames, className])} />;
        case "star-solid":
            return (
                <StarSolidIcon className={cn([baseClassNames, className])} />
            );
        case "job":
            return (
                <DocumentTextIcon className={cn([baseClassNames, className])} />
            );
        case "devicePhoneMobile":
            return (
                <DevicePhoneMobileIcon
                    className={cn([baseClassNames, className])}
                />
            );

        case "chartBarSquare":
            return (
                <ChartBarSquareIcon
                    className={cn([baseClassNames, className])}
                />
            );

        case "magnifyingGlass":
            return (
                <MagnifyingGlassCircleIcon
                    className={cn([baseClassNames, className])}
                />
            );

        case "cpuChip":
            return <CpuChipIcon className={cn([baseClassNames, className])} />;
        case "globe":
            return <GlobeAltIcon className={cn([baseClassNames, className])} />;
        case "check":
            return <CheckIcon className={cn([baseClassNames, className])} />;
        default:
            return <svg {...props}></svg>;
    }
}
