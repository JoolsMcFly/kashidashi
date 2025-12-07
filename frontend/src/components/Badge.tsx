type Type = "code" | "location";

interface BadgeProps {
    content: string | number;
    type: Type;
}

const backgroundByType: {[key: string]: string} = {
    "code": "#667eea",
    "location": "#10b981"
}

export default function Badge({content, type}: BadgeProps) {
    return <span
        className="inline-block px-3 py-1 rounded-md text-sm font-semibold text-white"
        style={{background: backgroundByType[type]}}
    >
        {content}
    </span>
}
