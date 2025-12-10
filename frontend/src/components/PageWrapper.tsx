import type { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
    return <div className="bg-white shadow-sm sticky top-0 z-10 mx-auto px-4 py-4" style={{boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
        { children }
    </div>
}
