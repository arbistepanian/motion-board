"use client";

import { ReactNode, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Heading from "./Heading";
import Button from "./Button";

interface DialogBoxProps {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    maxWidth?: string; // e.g., "max-w-sm", "max-w-md", etc.
}

export default function DialogBox({
    open,
    title,
    onClose,
    children,
    className = "",
    maxWidth = "max-w-sm",
}: DialogBoxProps) {
    const [isOpen, setIsOpen] = useState(open);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    return (
        <Transition appear show={isOpen} as="div">
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm"
                    aria-hidden="true"
                />

                {/* Modal Panel */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div
                        className={`relative flex flex-col items-center justify-center w-full ${maxWidth} max-h-[calc(100vh-40px)] rounded-lg p-4 shadow-xl space-y-4 bg-[var(--color-surface)] text-[var(--color-text)] ${className}`}>
                        <div className="w-full flex justify-between items-center h-10">
                            {title && <Heading level={2}>{title}</Heading>}
                            <div className="flex items-center justify-end">
                                <Button
                                    variation="ghost"
                                    icon="X"
                                    onClick={handleClose}
                                />
                            </div>
                        </div>
                        <div
                            className={`relative w-full max-h-full overflow-y-auto`}>
                            {children}
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
