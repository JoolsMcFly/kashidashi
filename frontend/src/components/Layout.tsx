import Logout from "./Logout.tsx";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export default function Layout({
  children,
  title = 'Kashidashi',
  subtitle = '',
  showBackButton = true,
}: LayoutProps) {

    const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
      <header className="bg-white shadow-sm sticky top-0 z-10" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div className="flex justify-between max-w-5xl mx-auto px-4 py-4 items-start">
            <div>
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => showBackButton && navigate(-1)}
                        className="px-2 py-2 rounded-lg text-xl"
                        style={{ background: '#f3f4f6' }}
                    >
                        {showBackButton ? '←' : '🏠'}
                    </button>
                    <h1 className="text-xl font-bold" style={{ color: '#111827' }}>
                      {title}
                    </h1>
                </div>
                {subtitle}
            </div>
            <Logout />
          </div>
      </header>
      <main className="max-w-5xl mx-auto px-2 py-2">{children}</main>
    </div>
  );
}
