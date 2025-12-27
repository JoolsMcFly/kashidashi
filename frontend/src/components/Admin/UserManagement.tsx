import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { User, Location } from '../../types';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    firstname: string;
    surname: string;
    roles: string;
    locationId: number | undefined;
  }>({
    email: '',
    password: '',
    firstname: '',
    surname: '',
    roles: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, {
          email: formData.email,
          firstname: formData.firstname,
          surname: formData.surname,
          roles: formData.roles,
          locationId: formData.locationId,
        });
      } else {
        await api.post('/users', formData);
      }

      resetForm();
      await loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      firstname: user.firstname || '',
      surname: user.surname || '',
      roles: user.roles,
      locationId: user.locationId || 1,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      await loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async (id: number) => {
    const newPassword = prompt('Enter new password (minimum 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await api.post(`/users/${id}/reset-password`, { newPassword });
      alert('Password reset successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reset password');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      firstname: '',
      surname: '',
      roles: '',
      locationId: locations[0]?.id || 1,
    });
    setEditingUser(null);
    setShowForm(false);
  };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
          Users
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-6 py-3 text-white font-semibold rounded-lg transition-colors"
            style={{ background: '#667eea' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#5568d3')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#667eea')}
          >
            + Add User
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Surname</label>
                <input
                  type="text"
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Role</label>
                <select
                  value={formData.roles}
                  onChange={(e) => setFormData({ ...formData, roles: e.target.value })}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_INVENTORY">Inventory</option>
                </select>
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
              onClick={resetForm}
              className="px-6 py-2 ml-2 text-white bg-gray-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
          </form>
        )}

        {!showForm && (
          <div className="flex flex-col gap-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 rounded-lg"
                style={{ background: '#f9fafb' }}
              >
                <span className="font-medium" style={{ color: '#111827' }}>
                  {user.firstname} {user.surname}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-xl p-1 border-none bg-transparent cursor-pointer hover:opacity-70"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-xl p-1 border-none bg-transparent cursor-pointer hover:opacity-70"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
}
