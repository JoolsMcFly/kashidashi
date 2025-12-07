import { useNavigate } from 'react-router-dom';

interface LoadingProps {
    title: string;
}

export default function Loading({title}: LoadingProps) {
    const navigate = useNavigate();

    return <div className="min-h-screen" style={{background: '#f3f4f6'}}>
        <div className="bg-white shadow-sm sticky top-0 z-10" style={{boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'}}>
            <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-2 py-2 rounded-lg text-xl"
                    style={{background: '#f3f4f6'}}
                >
                    ←
                </button>
                <h1 className="text-xl font-semibold" style={{color: '#111827'}}>
                    {title}
                </h1>
            </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-4">Loading...</div>
    </div>
}
