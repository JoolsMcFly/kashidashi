import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import type { Borrower, Book } from '../types';
import BorrowerSuggestion from "../components/BorrowerSuggestion.tsx";
import BookSuggestion from "../components/BookSuggestion.tsx";
import { inventoryService } from '../services/inventory';
import { statsService, type Stats } from '../services/stats';
import type { Inventory } from "../types";
import { useAuth } from "../contexts/AuthContext.tsx";

interface SearchResult {
  books: Book[];
  borrowers: Borrower[];
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [borrowerResults, setBorrowerResults] = useState<Borrower[]>([]);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInventory, setCurrentInventory] = useState<Inventory | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const navigate = useNavigate();
  const {isInventoryUser, isAdmin} = useAuth();

  const loadCurrentInventory = async () => {
    if (!isInventoryUser) {
        return;
    }

    const currentInventory = await inventoryService.getCurrent();
    setCurrentInventory(currentInventory);
  };

  const loadStats = async () => {
    if (isAdmin) {
      return;
    }

    try {
      const data = await statsService.get();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadCurrentInventory();
    loadStats();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch();
      } else {
        setBorrowerResults([]);
        setBookResults([]);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim() || query.trim().length < 2) return;

    setLoading(true);
    try {
      const response = await api.get<SearchResult>(`/search?q=${encodeURIComponent(query)}`);
      setBorrowerResults(response.data.borrowers);
      setBookResults(response.data.books);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinInventory = () => {
      if (currentInventory) {
        navigate('/inventory');
      }
  };

    return (
    <Layout title="KashiDashi" showBackButton={false}>
      <div className="max-w-2xl mx-auto">
        {currentInventory && isInventoryUser && <div className={"mb-6 px-2 py-2 bg-yellow-100 rounded-lg shadow-md text-gray-600 text-center"} onClick={joinInventory}><a><span className={"mr-2"}>📋</span> Join the open inventory!</a></div>}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by book code or borrower name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          {borrowerResults.length <= 0 && bookResults.length <= 0 && query.trim().length <= 0 &&
          <p className="mt-3 text-sm text-gray-500">
            💡 Tip: Type at least 2 characters.<br />Use numbers for books, text for borrowers.
          </p>
          }
            {borrowerResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-md">
                    <ul className="divide-y">
                        {borrowerResults.map((borrower) => (
                            <BorrowerSuggestion
                                key={borrower.id}
                                borrower={borrower}
                                onClick={() => navigate(`/borrower/${borrower.id}`)}
                            />
                        ))}
                    </ul>
                </div>
            )}

            {bookResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-md">
                    <ul className="divide-y">
                        {bookResults.map((book) => (
                            <BookSuggestion
                                key={book.id}
                                book={book}
                                onClick={() => navigate(`/book/${book.id}`)}
                            />
                        ))}
                    </ul>
                </div>
            )}

            {!loading && borrowerResults.length === 0 && bookResults.length === 0 && query && (
                <div className="mt-2 p-4 rounded-lg text-center text-sm text-gray-500">
                    No results found
                </div>
            )}
          {loading && (
            <p className="mt-2 text-sm text-gray-500">Searching...</p>
          )}
        </div>

        {stats && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Library stats</h2>
            <ul className="space-y-1 text-gray-700">
              <li>Book count: <span className="font-semibold">{stats.books}</span></li>
              <li>Active loan count: <span className="font-semibold">{stats.loans.count}</span></li>
              <li>Family count: <span className="font-semibold">{stats.borrowers}</span></li>
              {stats.loans.overdue > 0 && (
                <li>
                  <a
                    href="/loans/overdue"
                    onClick={(e) => { e.preventDefault(); navigate('/loans/overdue'); }}
                    className="text-red-600 underline"
                  >
                    Overdue loans: <span className="font-semibold">{stats.loans.overdue}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
