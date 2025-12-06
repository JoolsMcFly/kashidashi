import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Borrower, Book } from '../types';

export default function BorrowerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [bookQuery, setBookQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadBorrower();
  }, [id]);

  useEffect(() => {
    if (bookQuery.length > 1) {
      searchBooks(bookQuery);
    } else {
      setBookSuggestions([]);
    }
  }, [bookQuery]);

  const loadBorrower = async () => {
    try {
      const response = await api.get<Borrower>(`/borrowers/${id}`);
      setBorrower(response.data);
    } catch (error) {
      console.error('Error loading borrower:', error);
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

  const handleCheckout = async (bookId: number) => {
    if (!id) return;

    setCheckingOut(true);
    try {
      await api.post('/loans', {
        borrowerId: parseInt(id),
        bookId,
      });
      setBookQuery('');
      setBookSuggestions([]);
      await loadBorrower();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to checkout book');
    } finally {
      setCheckingOut(false);
    }
  };

  const handleReturn = async (loanId: number) => {
    try {
      await api.put(`/loans/${loanId}/return`, {});
      await loadBorrower();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to return book');
    }
  };

  const getDaysBetween = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
        <div className="bg-white shadow-sm sticky top-0 z-10" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-2 py-2 rounded-lg text-xl"
              style={{ background: '#f3f4f6' }}
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Loading...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!borrower) {
    return (
      <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
        <div className="bg-white shadow-sm sticky top-0 z-10" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-2 py-2 rounded-lg text-xl"
              style={{ background: '#f3f4f6' }}
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>Borrower not found</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const activeLoans = borrower.loans?.filter((loan) => !loan.returnDate) || [];
  const loanHistory = borrower.loans?.filter((loan) => loan.returnDate) || [];

  return (
    <div className="min-h-screen" style={{ background: '#f3f4f6' }}>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-2 py-2 rounded-lg text-xl"
            style={{ background: '#f3f4f6' }}
          >
            ←
          </button>
          <div>
            <h1 className="text-xl font-semibold" style={{ color: '#111827' }}>
              {borrower.katakana}
            </h1>
            <p className="text-sm text-gray-600">{borrower.frenchSurname}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Search Box */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <label className="block text-gray-700 font-medium mb-2 text-sm">
            Add a book by Code
          </label>
          <div className="relative">
            <input
              type="text"
              value={bookQuery}
              onChange={(e) => setBookQuery(e.target.value)}
              placeholder="Enter book code..."
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea]"
              disabled={checkingOut}
            />
            {bookSuggestions.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg bg-white overflow-hidden">
                {bookSuggestions.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => handleCheckout(book.id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <strong>{book.code}</strong> - {book.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Loans */}
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Active Loans
        </h3>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
          {activeLoans.length > 0 ? (
            activeLoans.map((loan) => (
              <div
                key={loan.id}
                className="p-4 border-b last:border-b-0 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: '#111827' }}>
                    <span
                      className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mr-2"
                      style={{ background: '#667eea' }}
                    >
                      {loan.book?.code}
                    </span>
                    {loan.book?.title}
                  </h3>
                  <p className="text-sm text-gray-600">Location: {loan.book?.location?.name}</p>
                  <p className="text-sm text-gray-600">
                    Since {new Date(loan.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleReturn(loan.id)}
                  className="px-3 py-2 rounded-md text-white font-medium"
                  style={{ background: '#ef4444' }}
                >
                  X
                </button>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              Add a book by using the above search
            </div>
          )}
        </div>

        {/* Loan History */}
        {loanHistory.length > 0 && (
          <>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full text-left flex items-center justify-between text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 hover:text-gray-800 transition-colors"
            >
              <span>Loan History ({loanHistory.length})</span>
              <span className="text-lg">{showHistory ? '▼' : '▶'}</span>
            </button>
            {showHistory && (
              <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
                {loanHistory.map((loan) => (
                  <div key={loan.id} className="py-3 border-b last:border-b-0" style={{ borderColor: '#f3f4f6' }}>
                    <h4 className="text-sm font-semibold mb-1" style={{ color: '#111827' }}>
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-semibold text-white mr-2"
                        style={{ background: '#667eea' }}
                      >
                        {loan.book?.code}
                      </span>
                      {loan.book?.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      From {new Date(loan.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })} to {new Date(loan.returnDate!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                      })} ({getDaysBetween(loan.startDate, loan.returnDate!)} days)
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
