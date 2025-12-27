import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import UserManagement from '../components/Admin/UserManagement';
import BooksManagement from '../components/Admin/BooksManagement';
import BorrowersManagement from '../components/Admin/BorrowersManagement';
import InventoryManagement from '../components/Admin/InventoryManagement';

type Tab = 'users' | 'books' | 'borrowers' | 'inventory';

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract tab from URL path (e.g., /admin/inventory -> 'inventory')
  const pathParts = location.pathname.split('/');
  const tabFromUrl = pathParts[2] as Tab | undefined;

  // Valid tabs
  const validTabs: Tab[] = ['users', 'books', 'borrowers', 'inventory'];
  const activeTab: Tab = validTabs.includes(tabFromUrl as Tab) ? (tabFromUrl as Tab) : 'users';

  // Redirect to /admin/users if on /admin with no tab
  useEffect(() => {
    if (location.pathname === '/admin' || !validTabs.includes(tabFromUrl as Tab)) {
      navigate('/admin/users', { replace: true });
    }
  }, [location.pathname, navigate, tabFromUrl]);

  const handleTabClick = (tab: Tab) => {
    navigate(`/admin/${tab}`);
  };

  return (
    <Layout showBackButton={false}>
        <div className="bg-white rounded-xl shadow-sm mb-2 flex w-full">
            {validTabs.map((item: Tab) => (
                <div
                  key={item}
                  className={`w-full p-6 text-center cursor-pointer ${activeTab === item ? "" : "bg-gray-100"}`}
                  onClick={() => handleTabClick(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </div>
            ))}
        </div>

      {/* Users Tab */}
      {activeTab === 'users' && <UserManagement />}

      {/* Books Tab */}
      {activeTab === 'books' && <BooksManagement />}

      {/* Borrowers Tab */}
      {activeTab === 'borrowers' && <BorrowersManagement />}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && <InventoryManagement />}
    </Layout>
  );
}
