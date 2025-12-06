import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import type { Borrower, Book } from '../types';

export default function BorrowerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [bookQuery, setBookQuery] = useState('');
  const [bookSuggestions, setBookSuggestions] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

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

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!borrower) {
    return (
      <Layout>
        <div>Borrower not found</div>
      </Layout>
    );
  }

  const activeLoans = borrower.loans?.filter((loan) => !loan.returnDate) || [];
  const loanHistory = borrower.loans?.filter((loan) => loan.returnDate) || [];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Search
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {borrower.firstname} {borrower.lastname}
          </h1>
          <div className="text-gray-600">
            {borrower.katakana} / {borrower.frenchSurname}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Checkout Book</h2>
          <div className="relative">
            <input
              type="text"
              value={bookQuery}
              onChange={(e) => setBookQuery(e.target.value)}
              placeholder="Search by book code..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={checkingOut}
            />
            {bookSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
                {bookSuggestions.map((book) => (
                  <li
                    key={book.id}
                    onClick={() => handleCheckout(book.id)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-gray-600">
                      Code: {book.code} | Location: {book.location?.name}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {activeLoans.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Active Loans</h2>
            <ul className="space-y-3">
              {activeLoans.map((loan) => (
                <li
                  key={loan.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <div>
                    <div className="font-medium">{loan.book?.title}</div>
                    <div className="text-sm text-gray-600">
                      Code: {loan.book?.code} | Started: {new Date(loan.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleReturn(loan.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Return
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loanHistory.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Loan History</h2>
            <ul className="space-y-2">
              {loanHistory.map((loan) => (
                <li key={loan.id} className="p-3 bg-gray-50 rounded-md">
                  <div className="font-medium">{loan.book?.title}</div>
                  <div className="text-sm text-gray-600">
                    Code: {loan.book?.code} |
                    {new Date(loan.startDate).toLocaleDateString()} - {new Date(loan.returnDate!).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
}
