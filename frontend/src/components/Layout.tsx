import { useState, useRef, useEffect } from 'react';
import Logout from "./Logout.tsx";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showMenu?: boolean;
  activeMenuItem?: string;
  onMenuItemClick?: (item: string) => void;
}

export default function Layout({
  children,
  title = 'Kashidashi',
  showMenu = false,
  activeMenuItem,
  onMenuItemClick
}: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
      <header className="bg-white shadow-sm sticky top-0 z-10" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div className="flex justify-between max-w-5xl mx-auto px-4 py-4 items-start">
          <h1 className="text-xl font-bold" style={{ color: '#111827' }}>
            {title}
          </h1>
          <div className="flex items-start gap-4">
            {showMenu && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="px-4 py-2 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                  style={{ background: '#667eea' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#5568d3')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#667eea')}
                >
                  ⚙️
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{
                      minWidth: '150px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {['Users', 'Books', 'Borrowers', 'Inventory'].map((item) => (
                      <div
                        key={item}
                        onClick={() => {
                          onMenuItemClick?.(item.toLowerCase());
                          setMenuOpen(false);
                        }}
                        className="px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors"
                        style={{
                          background: activeMenuItem === item.toLowerCase() ? '#eef2ff' : 'white',
                          color: activeMenuItem === item.toLowerCase() ? '#667eea' : '#111827',
                          fontWeight: activeMenuItem === item.toLowerCase() ? 600 : 400,
                          borderColor: '#f3f4f6'
                        }}
                        onMouseEnter={(e) => {
                          if (activeMenuItem !== item.toLowerCase()) {
                            e.currentTarget.style.background = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeMenuItem !== item.toLowerCase()) {
                            e.currentTarget.style.background = 'white';
                          }
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Logout />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-2 py-2">{children}</main>
    </div>
  );
}
