import { useState, useEffect } from 'react';
import { inventoryService } from '../../services/inventory';
import Layout from '../../components/Layout';
import type { Inventory } from '../../types';

export default function InventoryAdmin() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    loadInventories();
  }, []);

  const loadInventories = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventories(data);
    } catch (error) {
      console.error('Error loading inventories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!confirm('Create a new inventory? This will start a new inventory session.')) return;

    setCreating(true);
    try {
      await inventoryService.create();
      await loadInventories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create inventory');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = async (id: number) => {
    if (!confirm('Close this inventory? This action cannot be undone.')) return;

    try {
      await inventoryService.close(id);
      await loadInventories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to close inventory');
    }
  };
  const hasOpenInventory = inventories.some((inv) => !inv.stoppedAt);

  return (
    <Layout title="Admin Panel">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{ color: '#111827' }}>
            Inventory Management
          </h2>
          <button
            onClick={handleCreate}
            disabled={hasOpenInventory || creating}
            className="px-6 py-3 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: '#667eea' }}
            onMouseEnter={(e) => !hasOpenInventory && !creating && (e.currentTarget.style.background = '#5568d3')}
            onMouseLeave={(e) => !hasOpenInventory && !creating && (e.currentTarget.style.background = '#667eea')}
          >
            {creating ? 'Creating...' : '+ New Inventory'}
          </button>
        </div>

        {hasOpenInventory && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: '#fef3c7', color: '#92400e' }}>
            <p className="text-sm font-medium">
              An inventory is currently open. Close it before creating a new one.
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : inventories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No inventories yet. Create one to get started.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inventories.map((inventory) => (
              <div
                key={inventory.id}
                className="p-4 rounded-lg border-2"
                style={{
                  background: inventory.stoppedAt ? '#f9fafb' : '#eef2ff',
                  borderColor: inventory.stoppedAt ? '#e5e7eb' : '#667eea',
                }}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold" style={{ color: '#111827' }}>
                        Inventory #{inventory.id}
                      </h3>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold text-white"
                        style={{
                          background: inventory.stoppedAt ? '#6b7280' : '#10b981',
                        }}
                      >
                        {inventory.stoppedAt ? 'Closed' : 'Open'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Started:</strong>{' '}
                        {new Date(inventory.startedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {inventory.stoppedAt && (
                        <p>
                          <strong>Stopped:</strong>{' '}
                          {new Date(inventory.stoppedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      )}
                      <p>
                        <strong>Books:</strong> {inventory.bookCount} / {inventory.availableBookCount} available
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!inventory.stoppedAt && (
                      <button
                        onClick={() => handleClose(inventory.id)}
                        className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                        style={{ background: '#ef4444' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
