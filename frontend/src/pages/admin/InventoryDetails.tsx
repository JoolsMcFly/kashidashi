import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { inventoryService } from '../../services/inventory';
import Layout from '../../components/Layout';
import Loading from '../../components/Loading';
import RoundedCard from '../../components/RoundedCard';
import type { Inventory } from '../../types';

const DOWNLOAD_ICON = '⬇';

function formatDateTimeParts(date: Date) {
  return {
    date: date.toISOString().slice(0, 10),
    time: date.toTimeString().slice(0, 5),
  };
}

function formatInventoryDates(inventory: Inventory): string {
  const start = new Date(inventory.startedAt);
  if (!inventory.stoppedAt) {
    const { date, time } = formatDateTimeParts(start);
    return `Started ${date} at ${time}`;
  }
  const stop = new Date(inventory.stoppedAt);
  const startParts = formatDateTimeParts(start);
  const stopParts = formatDateTimeParts(stop);
  if (startParts.date === stopParts.date) {
    return `${startParts.date} from ${startParts.time} to ${stopParts.time}`;
  }
  return `${startParts.date} - ${stopParts.date}`;
}

function formatDuration(inventory: Inventory): string | null {
  if (!inventory.stoppedAt) return null;
  const diffMs = new Date(inventory.stoppedAt).getTime() - new Date(inventory.startedAt).getTime();
  if (diffMs < 3600000) {
    return `${Math.round(diffMs / 60000)} minutes`;
  }
  return `${Math.round(diffMs / 3600000)} hours`;
}

export default function InventoryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [stats, setStats] = useState<{ toMove: number; missing: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingToMove, setDownloadingToMove] = useState(false);
  const [downloadingMissing, setDownloadingMissing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const inventoryId = parseInt(id, 10);
    (async () => {
      try {
        const [inv, s] = await Promise.all([
          inventoryService.getOne(inventoryId),
          inventoryService.getStats(inventoryId),
        ]);
        setInventory(inv);
        setStats(s);
      } catch (error) {
        console.error('Error loading inventory details:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDownloadToMove = async () => {
    if (!inventory) return;
    setDownloadingToMove(true);
    try {
      await inventoryService.downloadBooksToMove(inventory.id);
    } catch (error) {
      console.error('Error downloading books to move:', error);
    } finally {
      setDownloadingToMove(false);
    }
  };

  const handleDownloadMissing = async () => {
    if (!inventory) return;
    setDownloadingMissing(true);
    try {
      await inventoryService.downloadMissingBooks(inventory.id);
    } catch (error) {
      console.error('Error downloading missing books:', error);
    } finally {
      setDownloadingMissing(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Inventory">
        <Loading />
      </Layout>
    );
  }

  if (!inventory) {
    return (
      <Layout title="Inventory">
        <RoundedCard>Inventory not found.</RoundedCard>
      </Layout>
    );
  }

  const duration = formatDuration(inventory);
  const missing = Math.max(inventory.availableBookCount - inventory.bookCount, 0);
  const isOpen = !inventory.stoppedAt;

  return (
    <Layout title={`Inventory #${inventory.id}`}>
      <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
        <div className="px-6 py-3" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
          <h2 className="font-semibold" style={{ color: '#111827' }}>
            Inventory summary
          </h2>
        </div>
        <div className="px-6 py-4 text-sm text-gray-700 space-y-1">
          <p>
            <span className="inline-block w-6">📅</span>
            {formatInventoryDates(inventory)}
          </p>
          {duration && (
            <p>
              <span className="inline-block w-6">⏱️</span>
              {duration}
            </p>
          )}
          <p>
            <span className="inline-block w-6">📖</span>
            {inventory.bookCount} / {inventory.availableBookCount}
          </p>
          {missing > 0 && (
            <p>
              <span className="inline-block w-6">☠️</span>
              {missing} missing books.
            </p>
          )}
          <p>
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
              style={{ background: isOpen ? '#10b981' : '#6b7280' }}
            >
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </p>
        </div>
      </div>

      {stats && (stats.toMove > 0 || stats.missing > 0) && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-3" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <h2 className="font-semibold" style={{ color: '#111827' }}>
              Download center
            </h2>
          </div>
          <div className="px-6 py-4 space-y-3 text-sm">
            {stats.toMove > 0 && (
              <button
                type="button"
                onClick={handleDownloadToMove}
                disabled={downloadingToMove}
                className="text-left w-full text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                {downloadingToMove ? 'Downloading...' : `Books to move (${stats.toMove}) ${DOWNLOAD_ICON}`}
              </button>
            )}
            {stats.missing > 0 && (
              <button
                type="button"
                onClick={handleDownloadMissing}
                disabled={downloadingMissing}
                className="text-left w-full text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                {downloadingMissing ? 'Downloading...' : `Download missing books (${stats.missing}) ${DOWNLOAD_ICON}`}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate('/admin/inventory')}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
        >
          Back to inventories
        </button>
      </div>
    </Layout>
  );
}
