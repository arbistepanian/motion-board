import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(...inputs));
}

export function toPlainObject<T>(doc: T): T {
    return JSON.parse(JSON.stringify(doc));
}
