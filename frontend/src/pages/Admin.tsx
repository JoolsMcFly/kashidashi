import { useState } from 'react';
import Layout from '../components/Layout';
import UserManagement from '../components/Admin/UserManagement';
import BooksManagement from '../components/Admin/BooksManagement';
import BorrowersManagement from '../components/Admin/BorrowersManagement';

type Tab = 'users' | 'books' | 'borrowers' | 'inventory';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  return (
    <Layout showBackButton={false}>
        <div className="bg-white rounded-xl shadow-sm mb-2 flex w-full">
            {["users", "borrowers", "books", "inventory"].map((item: Tab) => (
                <div className={`w-full p-6 text-center ${activeTab === item ? "" : "bg-gray-100"}`} onClick={() => setActiveTab(item)}>{item.substr(0, 1).toUpperCase()+item.substr(1)}</div>
            ))}
        </div>

      {/* Users Tab */}
      {activeTab === 'users' && <UserManagement />}

      {/* Books Tab */}
      {activeTab === 'books' && <BooksManagement />}

      {/* Borrowers Tab */}
      {activeTab === 'borrowers' && <BorrowersManagement />}
    </Layout>
  );
}
