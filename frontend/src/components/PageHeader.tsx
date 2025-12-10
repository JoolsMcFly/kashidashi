import { useNavigate } from "react-router-dom";
import Logout from "./Logout.tsx";
import type { Path } from "react-router-dom";

interface NotFoundProps {
    title: string;
    returnTo: string| Partial<Path>;
}

export default function PageHeader({title, returnTo}: NotFoundProps) {
    const navigate = useNavigate();

    return <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="max-w-3xl mx-auto flex items-center gap-4">
                        <button
                            onClick={() => navigate(returnTo)}
                            className="px-2 py-2 rounded-lg text-xl"
                            style={{background: '#f3f4f6'}}
                        >
                            🏠
                        </button>
                        <div>
                            <h1 className="text-xl font-semibold" style={{color: '#111827'}}>{title}</h1>
                        </div>
                    </div>
                </div>
                <Logout/>
            </div>
}
