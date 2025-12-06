import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import type { Borrower, Book } from '../types';

interface SearchResult {
  books: Book[];
  borrowers: Borrower[];
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [borrowerResults, setBorrowerResults] = useState<Borrower[]>([]);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Layout title="Search">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Search by book code or borrower name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            💡 Tip: Use numbers to search for books (e.g., "JPN-001"), or text to search for borrowers
          </p>
        </div>

        {borrowerResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold p-4 border-b">Borrowers</h2>
            <ul className="divide-y">
              {borrowerResults.map((borrower) => (
                <li
                  key={borrower.id}
                  onClick={() => navigate(`/borrower/${borrower.id}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">
                    {borrower.firstname} {borrower.lastname}
                  </div>
                  <div className="text-sm text-gray-600">
                    {borrower.katakana} / {borrower.frenchSurname}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {bookResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold p-4 border-b">Books</h2>
            <ul className="divide-y">
              {bookResults.map((book) => (
                <li
                  key={book.id}
                  onClick={() => navigate(`/book/${book.id}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="font-medium">{book.title}</div>
                  <div className="text-sm text-gray-600">
                    Code: {book.code} | Location: {book.location?.name}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!loading && borrowerResults.length === 0 && bookResults.length === 0 && query && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            No results found
          </div>
        )}
      </div>
    </Layout>
  );
}
