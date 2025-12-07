import { useAuth } from "../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-white font-medium rounded-md transition-colors"
                style={{background: '#ef4444'}}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
            >
                Logout
            </button>
            <span className="text-xs text-gray-400">v{__APP_VERSION__}</span>
        </div>
    )
}
