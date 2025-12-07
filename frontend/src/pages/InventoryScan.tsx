import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../services/inventory';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { Inventory, InventoryItem, Book } from '../types';

type Tab = 'scanned' | 'misplaced' | 'by-location';

export default function InventoryScan() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [scannedItems, setScannedItems] = useState<InventoryItem[]>([]);
  const [misplacedItems, setMisplacedItems] = useState<InventoryItem[]>([]);
  const [byLocationItems, setByLocationItems] = useState<Record<string, InventoryItem[]>>({});
  const [bookQuery, setBookQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState<Book[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('scanned');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadCurrentInventory();
  }, []);

  useEffect(() => {
    if (bookQuery.length > 1) {
      searchBooks(bookQuery);
    } else {
      setBookSuggestions([]);
    }
  }, [bookQuery]);

  useEffect(() => {
    if (inventory && activeTab === 'misplaced') {
      loadMisplaced();
    } else if (inventory && activeTab === 'by-location') {
      loadByLocation();
    }
  }, [activeTab, inventory]);

  const loadCurrentInventory = async () => {
    try {
      const current = await inventoryService.getCurrent();
      if (!current) {
        alert('No inventory is currently open. Please ask an admin to create one.');
        navigate('/search');
        return;
      }
      setInventory(current);
      setScannedItems(current.items || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
      alert('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async (query: string) => {
    try {
      const response = await api.get<Book[]>(`/books/search?q=${encodeURIComponent(query)}`);
      setBookSuggestions(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleAddBook = async (book: Book) => {
    if (!inventory || !user?.locationId) return;

    setAdding(true);
    try {
      const newItem = await inventoryService.addItem(inventory.id, book.id, user.locationId);
      setScannedItems([newItem, ...scannedItems]);
      setBookQuery('');
      setBookSuggestions([]);

      // Update inventory stats
      const updated = await inventoryService.getCurrent();
      if (updated) {
        setInventory(updated);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add book to inventory');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!inventory) return;

    try {
      await inventoryService.removeItem(inventory.id, itemId);
      setScannedItems(scannedItems.filter((item) => item.id !== itemId));

      // Update inventory stats
      const updated = await inventoryService.getCurrent();
      if (updated) {
        setInventory(updated);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const loadMisplaced = async () => {
    if (!inventory) return;

    try {
      const items = await inventoryService.getMisplaced(inventory.id);
      setMisplacedItems(items);
    } catch (error) {
      console.error('Error loading misplaced items:', error);
    }
  };

  const loadByLocation = async () => {
    if (!inventory) return;

    try {
      const items = await inventoryService.getByLocation(inventory.id);
      setByLocationItems(items);
    } catch (error) {
      console.error('Error loading items by location:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isBookMisplaced = (item: InventoryItem): boolean => {
    return item.book.locationId !== user?.locationId;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!inventory) {
    return (
      <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>
              No Inventory Open
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // TODO display user location next to the title
  return (
    <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>
                Inventory Scan
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {inventory.bookCount} / {inventory.availableBookCount} books scanned
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white font-medium rounded-md transition-colors"
              style={{ background: '#ef4444' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
            >
              Logout
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min((inventory.bookCount / inventory.availableBookCount) * 100, 100)}%`,
                background: '#667eea',
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Search Box */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Scan book by Code
          </label>
          <div className="relative">
            <input
              type="text"
              value={bookQuery}
              onChange={(e) => setBookQuery(e.target.value)}
              placeholder="Enter book code..."
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
              disabled={adding}
              autoFocus
            />
            {bookSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 border border-gray-200 rounded-lg bg-white overflow-hidden shadow-lg z-20">
                {bookSuggestions.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleAddBook(book)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                        style={{ background: '#667eea' }}
                      >
                        {book.code}
                      </span>
                      <span className="font-medium">{book.title}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Location: {book.location?.name || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('scanned')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === 'scanned' ? '#667eea' : '#f3f4f6',
              color: activeTab === 'scanned' ? 'white' : '#6b7280',
            }}
          >
            Scanned ({scannedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('misplaced')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === 'misplaced' ? '#667eea' : '#f3f4f6',
              color: activeTab === 'misplaced' ? 'white' : '#6b7280',
            }}
          >
            Misplaced
          </button>
          <button
            onClick={() => setActiveTab('by-location')}
            className="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === 'by-location' ? '#667eea' : '#f3f4f6',
              color: activeTab === 'by-location' ? 'white' : '#6b7280',
            }}
          >
            By Location
          </button>
        </div>

        {/* Scanned Items Tab */}
        {activeTab === 'scanned' && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {scannedItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No books scanned yet. Use the search above to add books.
              </div>
            ) : (
              scannedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b last:border-b-0 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                        style={{ background: '#667eea' }}
                      >
                        {item.book.code}
                      </span>
                      <h3 className="font-semibold" style={{ color: '#111827' }}>
                        {item.book.title}
                      </h3>
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        color: isBookMisplaced(item) ? '#ef4444' : '#6b7280',
                        fontWeight: isBookMisplaced(item) ? 600 : 400,
                      }}
                    >
                      Location: {item.book.location?.name || 'Unknown'}
                      {isBookMisplaced(item) && ' (MISPLACED)'}
                      {item.book.loans?.length && <span className={"ml-2"}>Borrowed by {item.book.loans[0].borrower.katakana}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="px-3 py-2 rounded-md text-white font-medium ml-2"
                    style={{ background: '#ef4444' }}
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Misplaced Tab */}
        {activeTab === 'misplaced' && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {misplacedItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                No misplaced books found.
              </div>
            ) : (
              misplacedItems.map((item) => (
                <div key={item.id} className="p-4 border-b last:border-b-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                      style={{ background: '#667eea' }}
                    >
                      {item.book.code}
                    </span>
                    <h3 className="font-semibold" style={{ color: '#111827' }}>
                      {item.book.title}
                    </h3>
                  </div>
                  <p className="text-sm" style={{ color: '#ef4444', fontWeight: 600 }}>
                    Found at: {item.foundAt.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Should be at: {item.book.location?.name || 'Unknown'}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* By Location Tab */}
        {activeTab === 'by-location' && (
          <div className="space-y-4">
            {Object.keys(byLocationItems).length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500 text-sm shadow-sm">
                No books scanned yet.
              </div>
            ) : (
              Object.entries(byLocationItems).map(([locationName, items]) => (
                <div key={locationName} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="px-4 py-3" style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 className="font-semibold" style={{ color: '#111827' }}>
                      {locationName} ({items.length})
                    </h3>
                  </div>
                  <div>
                    {items.map((item) => (
                      <div key={item.id} className="p-3 border-b last:border-b-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white"
                            style={{ background: '#667eea' }}
                          >
                            {item.book.code}
                          </span>
                          <span className="text-sm font-medium">{item.book.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
