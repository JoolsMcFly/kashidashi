import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import type { Book, Loan } from '../types';

export default function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
  const [borrowCount, setBorrowCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      const [bookRes, loanRes, countRes] = await Promise.all([
        api.get<Book>(`/books/${id}`),
        api.get<Loan>(`/books/${id}/current-loan`),
        api.get<number>(`/books/${id}/borrow-count`),
      ]);

      setBook(bookRes.data);
      setCurrentLoan(loanRes.data);
      setBorrowCount(countRes.data);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!currentLoan) return;

    try {
      await api.put(`/loans/${currentLoan.id}/return`, {});
      await loadBook();
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

  if (!book) {
    return (
      <Layout>
        <div>Book not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-blue-600 hover:text-blue-800"
        >
          ← Back to Search
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
          <div className="space-y-2 text-gray-700">
            <div>
              <span className="font-medium">Code:</span> {book.code}
            </div>
            <div>
              <span className="font-medium">Location:</span> {book.location?.name}
            </div>
            <div>
              <span className="font-medium">Total times borrowed:</span> {borrowCount}
            </div>
          </div>
        </div>

        {currentLoan ? (
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-yellow-900">Currently On Loan</h2>
            <div className="space-y-2 mb-4">
              <div>
                <span className="font-medium">Borrower:</span>{' '}
                {currentLoan.borrower?.firstname} {currentLoan.borrower?.lastname}
              </div>
              <div>
                <span className="font-medium">Since:</span>{' '}
                {new Date(currentLoan.startDate).toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={handleReturn}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Return Book
            </button>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-md text-center">
            <div className="text-xl font-semibold text-green-900">Available</div>
            <div className="text-sm text-green-700 mt-2">This book is currently available for loan</div>
          </div>
        )}
      </div>
    </Layout>
  );
}
