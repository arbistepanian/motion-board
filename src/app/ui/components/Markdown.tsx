import { cn } from "@/app/lib/utils/utils";
import ReactMarkdown from "react-markdown";

type Props = {
    content: string;
    className?: string;
    anchorTarget?: "_blank" | "_self" | "_parent" | "_top";
};

export default function Markdown({
    content,
    anchorTarget = "_blank",
    className = "",
}: Props) {
    return (
        <div className={cn(["prose prose-sm max-w-full", className])}>
            <ReactMarkdown
                components={{
                    h1: ({ ...props }) => (
                        <h1
                            className="text-3xl font-bold mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h2: ({ ...props }) => (
                        <h2
                            className="text-2xl font-semibold mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h3: ({ ...props }) => (
                        <h3
                            className="text-xl font-medium mt-4 mb-2"
                            {...props}
                        />
                    ),
                    ul: ({ ...props }) => (
                        <ul
                            className="list-disc pl-6 my-2 space-y-1"
                            {...props}
                        />
                    ),
                    ol: ({ ...props }) => (
                        <ol
                            className="list-decimal pl-6 my-2 space-y-1"
                            {...props}
                        />
                    ),
                    li: ({ ...props }) => (
                        <li className="text-sm leading-relaxed" {...props} />
                    ),
                    p: ({ ...props }) => (
                        <p className="my-2 leading-relaxed" {...props} />
                    ),
                    strong: ({ ...props }) => (
                        <strong className="font-semibold" {...props} />
                    ),
                    em: ({ ...props }) => <em className="italic" {...props} />,
                    a: ({ ...props }) => (
                        <a
                            className="text-blue-600 underline hover:text-blue-800"
                            target={anchorTarget}
                            {...props}
                        />
                    ),
                    code: ({ children, ...props }) => (
                        <code
                            className={`px-1 py-0.5 rounded text-xs font-mono inline`}
                            {...props}>
                            {children}
                        </code>
                    ),
                }}>
                {content}
            </ReactMarkdown>
        </div>
    );
}
