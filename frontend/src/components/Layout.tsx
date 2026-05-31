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
    <div className="min-h-screen pb-20" style={{ background: '#f3f4f6' }}>
      <header className="bg-white shadow-sm" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
                {showBackButton && (
                    <button
                        onClick={() => navigate(-1)}
                        className="px-2 py-2 rounded-lg text-xl"
                        style={{ background: '#f3f4f6' }}
                        aria-label="Go back"
                    >
                        ←
                    </button>
                )}
                <h1 className="text-xl font-bold" style={{ color: '#111827' }}>
                  {title}
                </h1>
            </div>
            {subtitle}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-2 py-2">{children}</main>
      <footer
        className="fixed bottom-0 left-0 right-0 bg-white"
        style={{ boxShadow: '0 -1px 3px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <button
                onClick={() => navigate('/')}
                className="px-4 py-2 rounded-lg text-xl"
                style={{ background: '#f3f4f6' }}
                aria-label="Go to home"
            >
                🏠
            </button>
            <Logout />
        </div>
      </footer>
    </div>
  );
}
