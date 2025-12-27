import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { UploadResult } from '../../types';

export default function BooksManagement() {
  const [booksFile, setBooksFile] = useState<File | null>(null);
  const [booksResult, setBooksResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [booksStats, setBooksStats] = useState<{ total: number; onLoan: number } | null>(null);

  useEffect(() => {
    loadBooksStats();
  }, []);

  const loadBooksStats = async () => {
    try {
      const response = await api.get<{ total: number; onLoan: number }>('/books/stats/count');
      setBooksStats(response.data);
    } catch (error) {
      console.error('Error loading books stats:', error);
    }
  };

  const handleBooksUpload = async () => {
    if (!booksFile) return;

    setUploading(true);
    setBooksResult(null);

    const formDataUpload = new FormData();
    formDataUpload.append('file', booksFile);

    try {
      const response = await api.post<UploadResult>('/upload/books', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBooksResult(response.data);
      setBooksFile(null);
      await loadBooksStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload books');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
        Books
      </h2>
      {booksStats && (
        <div className="mb-6 pb-6 border-b border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Total books: <strong>{booksStats.total}</strong> • On loan: <strong>{booksStats.onLoan}</strong>
          </p>
        </div>
      )}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
        style={{ borderColor: '#d1d5db' }}
        onClick={() => document.getElementById('books-file-input')?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = '#667eea';
          e.currentTarget.style.background = '#eef2ff';
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.background = 'transparent';
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderColor = '#d1d5db';
          e.currentTarget.style.background = 'transparent';
          const file = e.dataTransfer.files[0];
          if (file) setBooksFile(file);
        }}
      >
        <div className="text-5xl mb-2">📚</div>
        <p className="text-gray-600 text-sm">
          {booksFile ? booksFile.name : 'Drop XLSX file here or click to browse'}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Expected columns: title, code, location, deleted
        </p>
        <input
          id="books-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setBooksFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>
      {booksFile && (
        <button
          onClick={handleBooksUpload}
          disabled={uploading}
          className="mt-4 px-6 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
          style={{ background: '#667eea' }}
        >
          {uploading ? 'Uploading...' : 'Upload Books'}
        </button>
      )}
      {booksResult && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Uploaded: <strong>{booksResult.success}</strong> • Failed: <strong>{booksResult.failed}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
