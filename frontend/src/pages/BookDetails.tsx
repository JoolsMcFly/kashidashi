import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Book, Borrower, Loan } from '../types';
import Loading from "../components/Loading.tsx";
import Badge from "../components/Badge.tsx";
import Layout from "../components/Layout.tsx";
import RoundedCard from "../components/RoundedCard.tsx";
import TextInput from "../components/TextInput.tsx";
import Label from "../components/Label.tsx";
import BorrowerSuggestion from "../components/BorrowerSuggestion.tsx";

export default function BookDetails() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    const [currentLoan, setCurrentLoan] = useState<Loan | null>(null);
    const [borrowCount, setBorrowCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [borrowerQuery, setBorrowerQuery] = useState('');
    const [borrowerSuggestions, setBorrowerSuggestions] = useState<Borrower[]>([]);
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        loadBook();
    }, [id]);

    useEffect(() => {
        if (borrowerQuery.length > 1) {
            searchBorrowers(borrowerQuery);
        } else {
            setBorrowerSuggestions([]);
        }
    }, [borrowerQuery]);

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

    const searchBorrowers = async (query: string) => {
        try {
            const response = await api.get<Borrower[]>(`/borrowers/search?q=${encodeURIComponent(query)}`);
            setBorrowerSuggestions(response.data);
        } catch (error) {
            console.error('Error searching borrowers:', error);
        }
    };

    const handleCheckout = async (borrowerId: number) => {
        if (!id) return;

        setCheckingOut(true);
        try {
            await api.post('/loans', {
                borrowerId,
                bookId: parseInt(id),
            });
            setBorrowerQuery('');
            setBorrowerSuggestions([]);
            await loadBook();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to checkout book');
        } finally {
            setCheckingOut(false);
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
        return <Layout title={"Book details"}>
            <Loading />
        </Layout>;
    }

    if (!book) {
        return (
            <Layout title={"Book details"}>
                <RoundedCard>Book not found</RoundedCard>
            </Layout>
        );
    }

    return (
        <Layout title={"Book Details"}>
            <RoundedCard>
                <h2 className="text-2xl font-bold mb-3" style={{color: '#111827'}}>
                    {book.title}
                </h2>
                <div className="flex gap-2 flex-wrap mb-3">
                    <Badge content={book.code} type={"code"}/>
                    {book.location?.name && <Badge content={book.location.name} type={"location"}/>}
                </div>
                <p className="text-gray-600 text-sm">Borrowed {borrowCount} times</p>
            </RoundedCard>

            {/* Current Loan Status Card */}
            <RoundedCard>
                <h3 className="text-lg font-semibold mb-4" style={{color: '#111827'}}>
                    Current Loan
                </h3>
                {currentLoan ? (
                    <div className="bg-red-50 p-3 rounded-lg">
                        <button
                            onClick={() => navigate(`/borrower/${currentLoan?.borrowerId}`)}
                            className="font-semibold hover:underline"
                            style={{color: '#667eea'}}
                        >
                            {currentLoan?.borrower.surname} (
                            {currentLoan?.borrower.katakana})
                        </button>
                        <p className="text-gray-600 text-sm mt-2">
                            Start Date: {new Date(currentLoan.startedAt).toISOString().slice(0, 10)}
                        </p>
                        <button
                            onClick={handleReturn}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                            Mark book as returned
                        </button>
                    </div>
                ) : (
                    <div>
                        <div
                            className="p-3 rounded-lg text-center font-semibold mb-4"
                            style={{background: '#d1fae5', color: '#065f46'}}
                        >
                            ✓ Available for Loan
                        </div>
                        <Label>Lend to borrower</Label>
                        <div className="relative">
                            <TextInput
                                type="text"
                                value={borrowerQuery}
                                onChange={(e) => setBorrowerQuery(e.target.value)}
                                placeholder="Search by name or katakana..."
                                disabled={checkingOut}
                            />
                            {borrowerSuggestions.length > 0 && (
                                <ul className="mt-2 border border-gray-200 rounded-lg bg-white overflow-hidden divide-y">
                                    {borrowerSuggestions.map((borrower) => (
                                        <BorrowerSuggestion
                                            key={borrower.id}
                                            borrower={borrower}
                                            onClick={() => handleCheckout(borrower.id)}
                                        />
                                    ))}
                                </ul>
                            )}
                            {borrowerSuggestions.length === 0 && borrowerQuery.length > 1 && (
                                <div className="mt-2 p-4 rounded-lg text-center text-sm text-gray-500">
                                    No results found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </RoundedCard>
        </Layout>
    );
}
