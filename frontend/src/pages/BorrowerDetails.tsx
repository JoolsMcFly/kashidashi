import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { Book, Borrower } from '../types';
import Loading from "../components/Loading.tsx";
import Badge from "../components/Badge.tsx";
import Layout from "../components/Layout.tsx";
import RoundedCard from "../components/RoundedCard.tsx";
import TextInput from "../components/TextInput.tsx";
import Label from "../components/Label.tsx";

export default function BorrowerDetails() {
  const { id } = useParams<{ id: string }>();
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

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
      return (
          <Layout title={"Borrower details"}>
              <Loading />
          </Layout>
      );
  }

  if (!borrower) {
      return (
          <Layout title={"Borrower details"}>
              <RoundedCard>Borrower not found</RoundedCard>
          </Layout>
      );
  }

  const activeLoans = borrower.loans?.filter((loan) => !loan.stoppedAt) || [];
  const loanHistory = borrower.loans?.filter((loan) => loan.stoppedAt) || [];

  return (
      <Layout title={borrower.katakana} subtitle={borrower.frenchSurname}>
          {/* Search Box */}
          <RoundedCard>
              <Label>
                  Add a book by code
              </Label>
              <div className="relative">
                  <TextInput
                      type="text"
                      value={bookQuery}
                      onChange={(e) => setBookQuery(e.target.value)}
                      placeholder="Enter book code..."
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
                                  <Badge content={book.code} type={"code"} /> <span className={"ml-2"}>{book.title}</span>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </RoundedCard>

          {/* Active Loans */}
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Active Loans
          </h3>
              {activeLoans.length > 0 ? (
                  activeLoans.map((loan) => (
                    <RoundedCard>
                      <div
                          key={loan.id}
                          className="flex justify-between items-start shadow-sm"
                      >
                          <div>
                              <h3 className="font-semibold mb-1" style={{ color: '#111827' }}>
                                  <Badge content={loan.book.code} type={"code"} />
                                  <span className={"ml-2"}>{loan.book.title}</span>
                              </h3>
                              {loan.book.location?.name && <Badge content={loan.book.location.name} type={"location"} />}
                              <p className="text-sm text-gray-600">
                                  Since {new Date(loan.startedAt).toISOString().slice(0, 10)}
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
                    </RoundedCard>
                  ))
              ) : (
                  <RoundedCard>
                      <span className="p-4 text-center text-gray-500 text-sm">No active loans. Add a book by using the above search <span className="text-2xl">☝️</span></span>
                  </RoundedCard>
              )}

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
                  {showHistory && loanHistory.map((loan) => (
                      <RoundedCard>
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
                                  From {new Date(loan.startedAt).toISOString().slice(0, 10)} to {new Date(loan.stoppedAt!).toISOString().slice(0, 10)} ({getDaysBetween(loan.startedAt, loan.stoppedAt!)} days)
                              </p>
                          </div>
                      </RoundedCard>
                  ))}
              </>
          )}
      </Layout>
  );
}
