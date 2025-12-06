import { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import type { User, Location, UploadResult } from '../types';

type Tab = 'users' | 'books' | 'borrowers';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [booksFile, setBooksFile] = useState<File | null>(null);
  const [borrowersFile, setBorrowersFile] = useState<File | null>(null);
  const [booksResult, setBooksResult] = useState<UploadResult | null>(null);
  const [borrowersResult, setBorrowersResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    isAdmin: false,
    locationId: 1,
  });

  useEffect(() => {
    loadUsers();
    loadLocations();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadLocations = async () => {
    try {
      const response = await api.get<Location[]>('/locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          isAdmin: formData.isAdmin,
          locationId: formData.locationId,
        });
      } else {
        await api.post('/users', formData);
      }

      resetUserForm();
      await loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      firstname: user.firstname,
      lastname: user.lastname,
      isAdmin: user.isAdmin,
      locationId: user.locationId,
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const resetUserForm = () => {
    setFormData({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      isAdmin: false,
      locationId: locations[0]?.id || 1,
    });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const handleBooksUpload = async () => {
    if (!booksFile) return;

    setUploading(true);
    setBooksResult(null);

    const formDataUpload = new FormData();
    formDataUpload.append('file', booksFile);

    try {
      const response = await api.post<UploadResult>('/upload/books', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBooksResult(response.data);
      setBooksFile(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload books');
    } finally {
      setUploading(false);
    }
  };

  const handleBorrowersUpload = async () => {
    if (!borrowersFile) return;

    setUploading(true);
    setBorrowersResult(null);

    const formDataUpload = new FormData();
    formDataUpload.append('file', borrowersFile);

    try {
      const response = await api.post<UploadResult>('/upload/borrowers', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBorrowersResult(response.data);
      setBorrowersFile(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload borrowers');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout
      showMenu={true}
      activeMenuItem={activeTab}
      onMenuItemClick={(item) => setActiveTab(item as Tab)}
    >

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
            Users
          </h2>
            {!showUserForm && <button
            onClick={() => setShowUserForm(!showUserForm)}
            className="mb-6 px-6 py-3 text-white font-semibold rounded-lg transition-colors"
            style={{ background: '#667eea' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#5568d3')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#667eea')}
          >
            + Add User
          </button>}

          {showUserForm && (
            <form onSubmit={handleUserSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
                    required
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">First Name</label>
                  <input
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2 text-white font-semibold rounded-lg"
                style={{ background: '#667eea' }}
              >
                {editingUser ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetUserForm}
                className="px-6 py-2 ml-2 text-white bg-gray-300 font-semibold rounded-lg"
              >
                Cancel
              </button>
            </form>
          )}

            {!showUserForm && <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 rounded-lg"
                style={{ background: '#f9fafb' }}
              >
                <span className="font-medium" style={{ color: '#111827' }}>
                  {user.firstname} {user.lastname}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-xl p-1 border-none bg-transparent cursor-pointer hover:opacity-70"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-xl p-1 border-none bg-transparent cursor-pointer hover:opacity-70"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
            Books
          </h2>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
            style={{ borderColor: '#d1d5db' }}
            onClick={() => document.getElementById('books-file-input')?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = '#eef2ff';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.background = 'transparent';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.background = 'transparent';
              const file = e.dataTransfer.files[0];
              if (file) setBooksFile(file);
            }}
          >
            <div className="text-5xl mb-2">📚</div>
            <p className="text-gray-600 text-sm">
              {booksFile ? booksFile.name : 'Drop XLSX file here or click to browse'}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Expected columns: title, code, location, deleted
            </p>
            <input
              id="books-file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setBooksFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
          {booksFile && (
            <button
              onClick={handleBooksUpload}
              disabled={uploading}
              className="mt-4 px-6 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
              style={{ background: '#667eea' }}
            >
              {uploading ? 'Uploading...' : 'Upload Books'}
            </button>
          )}
          {booksResult && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Uploaded: <strong>{booksResult.success}</strong> • Failed: <strong>{booksResult.failed}</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Borrowers Tab */}
      {activeTab === 'borrowers' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
            Borrowers
          </h2>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
            style={{ borderColor: '#d1d5db' }}
            onClick={() => document.getElementById('borrowers-file-input')?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = '#eef2ff';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.background = 'transparent';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.background = 'transparent';
              const file = e.dataTransfer.files[0];
              if (file) setBorrowersFile(file);
            }}
          >
            <div className="text-5xl mb-2">📤</div>
            <p className="text-gray-600 text-sm">
              {borrowersFile ? borrowersFile.name : 'Drop XLSX file here or click to browse'}
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Expected columns: firstname, lastname, katakana, frenchSurname
            </p>
            <input
              id="borrowers-file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setBorrowersFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
          {borrowersFile && (
            <button
              onClick={handleBorrowersUpload}
              disabled={uploading}
              className="mt-4 px-6 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
              style={{ background: '#667eea' }}
            >
              {uploading ? 'Uploading...' : 'Upload Borrowers'}
            </button>
          )}
          {borrowersResult && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm">
                Uploaded: <strong>{borrowersResult.success}</strong> • Failed: <strong>{borrowersResult.failed}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
