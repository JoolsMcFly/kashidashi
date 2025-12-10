import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Book, Loan } from '../types';
import Loading from "../components/Loading.tsx";
import Badge from "../components/Badge.tsx";
import Layout from "../components/Layout.tsx";
import RoundedCard from "../components/RoundedCard.tsx";

export default function BookDetails() {
    const {id} = useParams<{ id: string }>();
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
            <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
                <h2 className="text-2xl font-bold mb-3" style={{color: '#111827'}}>
                    {book.title}
                </h2>
                <div className="flex gap-2 flex-wrap mb-3">
                    <Badge content={book.code} type={"code"}/>
                    {book.location?.name && <Badge content={book.location.name} type={"location"}/>}
                </div>
                <p className="text-gray-600 text-sm">Borrowed {borrowCount} times</p>
            </div>

            {/* Current Loan Status Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4" style={{color: '#111827'}}>
                    Current Loan
                </h3>
                {currentLoan ? (
                    <div className="bg-red-50 p-3 rounded-lg">
                        <button
                            onClick={() => navigate(`/borrower/${currentLoan.borrower?.id}`)}
                            className="font-semibold hover:underline"
                            style={{color: '#667eea'}}
                        >
                            {currentLoan.borrower?.firstname} {currentLoan.borrower?.surname} (
                            {currentLoan.borrower?.katakana})
                        </button>
                        <p className="text-gray-600 text-sm mt-2">
                            Start Date: {new Date(currentLoan.startedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </p>
                        <button
                            onClick={handleReturn}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                            Return Book
                        </button>
                    </div>
                ) : (
                    <div
                        className="p-3 rounded-lg text-center font-semibold"
                        style={{background: '#d1fae5', color: '#065f46'}}
                    >
                        ✓ Available for Loan
                    </div>
                )}
            </div>
        </Layout>
    );
}
