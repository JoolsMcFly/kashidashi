import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center text-xl font-bold text-gray-900">
                Kashidashi
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Search
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/users"
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/upload"
                      className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Upload
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {user?.firstname} {user?.lastname}
                {isAdmin && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
