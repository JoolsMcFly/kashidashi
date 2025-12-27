import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { UploadResult } from '../../types';

export default function BorrowersManagement() {
  const [borrowersFile, setBorrowersFile] = useState<File | null>(null);
  const [borrowersResult, setBorrowersResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [borrowersStats, setBorrowersStats] = useState<{ total: number } | null>(null);

  useEffect(() => {
    loadBorrowersStats();
  }, []);

  const loadBorrowersStats = async () => {
    try {
      const response = await api.get<{ total: number }>('/borrowers/stats/count');
      setBorrowersStats(response.data);
    } catch (error) {
      console.error('Error loading borrowers stats:', error);
    }
  };

  const handleBorrowersUpload = async () => {
    if (!borrowersFile) return;

    setUploading(true);
    setBorrowersResult(null);

    const formDataUpload = new FormData();
    formDataUpload.append('file', borrowersFile);

    try {
      const response = await api.post<UploadResult>('/upload/borrowers', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBorrowersResult(response.data);
      setBorrowersFile(null);
      await loadBorrowersStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload borrowers');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
        Borrowers
      </h2>
      {borrowersStats && (
        <div className="mb-6 pb-6 border-b border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Total borrowers: <strong>{borrowersStats.total}</strong>
          </p>
        </div>
      )}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
        style={{ borderColor: '#d1d5db' }}
        onClick={() => document.getElementById('borrowers-file-input')?.click()}
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
          if (file) setBorrowersFile(file);
        }}
      >
        <div className="text-5xl mb-2">📤</div>
        <p className="text-gray-600 text-sm">
          {borrowersFile ? borrowersFile.name : 'Drop XLSX file here or click to browse'}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Expected columns: firstname, surname, katakana, frenchSurname
        </p>
        <input
          id="borrowers-file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setBorrowersFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>
      {borrowersFile && (
        <button
          onClick={handleBorrowersUpload}
          disabled={uploading}
          className="mt-4 px-6 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
          style={{ background: '#667eea' }}
        >
          {uploading ? 'Uploading...' : 'Upload Borrowers'}
        </button>
      )}
      {borrowersResult && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Uploaded: <strong>{borrowersResult.success}</strong> • Failed: <strong>{borrowersResult.failed}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
