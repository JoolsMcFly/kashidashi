type Type = "code" | "location";

interface BadgeProps {
    content: string | number;
    type: Type;
    small?: boolean;
}

const backgroundByType: {[key: string]: string} = {
    "code": "#667eea",
    "location": "#10b981"
}

export default function Badge({content, type, small=false}: BadgeProps) {
    const classes = small === true ? "px-2 py-0.5" : "px-3 py-1";

    return <span
        className={`inline-block ${classes} rounded-md text-sm font-semibold text-white`}
        style={{background: backgroundByType[type]}}
    >
        {content}
    </span>
}
