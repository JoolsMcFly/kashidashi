import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import RoundedCard from '../components/RoundedCard';
import Badge from '../components/Badge';
import type { Loan } from '../types';

const dayMs = 1000 * 60 * 60 * 24;

function durationInDays(startedAt: string): number {
  return Math.floor((Date.now() - new Date(startedAt).getTime()) / dayMs);
}

export default function OverdueLoans() {
  const [loans, setLoans] = useState<Loan[] | null>(null);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOverdue();
  }, []);

  const loadOverdue = async () => {
    try {
      const response = await api.get<Loan[]>('/loans/overdue');
      setLoans(response.data);
    } catch (error) {
      console.error('Failed to load overdue loans:', error);
      setLoans([]);
    }
  };

  const downloadCsv = async () => {
    setDownloading(true);
    try {
      const response = await api.get('/loans/overdue/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `overdue-loans-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download CSV:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loans === null) {
    return (
      <Layout title="Overdue loans">
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout title="Overdue loans">
      <div className="max-w-3xl mx-auto">
        <RoundedCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {loans.length > 0 ? `${loans.length} overdue loan${loans.length > 1 ? 's' : ''}` : 'No overdue loans'}
            </h2>
            {loans.length > 0 && (
              <button
                onClick={downloadCsv}
                disabled={downloading}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {downloading ? 'Downloading…' : 'Download CSV'}
              </button>
            )}
          </div>

          {loans.length > 0 && (
            <ul className="divide-y">
              {loans.map((loan) => (
                <li key={loan.id} className="py-3">
                  <div className="flex flex-wrap gap-2 mb-1">
                    <Badge content={loan.book.code} type="code" />
                    {loan.book.location?.name && (
                      <Badge content={loan.book.location.name} type="location" />
                    )}
                    <Badge content={`${durationInDays(loan.startedAt)} days`} type="danger" />
                  </div>
                  <button
                    onClick={() => navigate(`/book/${loan.book.id}`)}
                    className="mt-2 mb-2 block font-medium text-gray-800 underline text-left"
                  >
                    {loan.book.title || '(untitled)'}
                  </button>
                  <button
                    onClick={() => navigate(`/borrower/${loan.borrowerId}`)}
                    className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 underline"
                  >
                    <span>
                      {loan.borrower.surname} ({loan.borrower.katakana})
                      {loan.borrower.frenchSurname && loan.borrower.frenchSurname !== loan.borrower.surname
                        ? ` ${loan.borrower.frenchSurname}`
                        : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </RoundedCard>
      </div>
    </Layout>
  );
}
