import { useState } from 'react';
import api from '../../services/api';
import Layout from '../../components/Layout';
import type { UploadResult } from '../../types';

export default function Upload() {
  const [borrowersFile, setBorrowersFile] = useState<File | null>(null);
  const [booksFile, setBooksFile] = useState<File | null>(null);
  const [borrowersResult, setBorrowersResult] = useState<UploadResult | null>(null);
  const [booksResult, setBooksResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const handleBorrowersUpload = async () => {
    if (!borrowersFile) return;

    setUploading('borrowers');
    setBorrowersResult(null);

    const formData = new FormData();
    formData.append('file', borrowersFile);

    try {
      const response = await api.post<UploadResult>('/upload/borrowers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBorrowersResult(response.data);
      setBorrowersFile(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload borrowers');
    } finally {
      setUploading(null);
    }
  };

  const handleBooksUpload = async () => {
    if (!booksFile) return;

    setUploading('books');
    setBooksResult(null);

    const formData = new FormData();
    formData.append('file', booksFile);

    try {
      const response = await api.post<UploadResult>('/upload/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBooksResult(response.data);
      setBooksFile(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload books');
    } finally {
      setUploading(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload XLSX Files</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Borrowers Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Borrowers</h2>
            <p className="text-sm text-gray-600 mb-4">
              Expected columns: firstname, lastname, katakana, frenchSurname
            </p>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setBorrowersFile(e.target.files?.[0] || null)}
              className="mb-4 w-full"
            />

            <button
              onClick={handleBorrowersUpload}
              disabled={!borrowersFile || uploading === 'borrowers'}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading === 'borrowers' ? 'Uploading...' : 'Upload Borrowers'}
            </button>

            {borrowersResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="text-sm space-y-1">
                  <div className="text-green-600">✓ Success: {borrowersResult.success}</div>
                  <div className="text-red-600">✗ Failed: {borrowersResult.failed}</div>
                </div>
                {borrowersResult.errors.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-600">
                      View Errors ({borrowersResult.errors.length})
                    </summary>
                    <div className="mt-2 max-h-40 overflow-auto text-xs">
                      {borrowersResult.errors.map((err, idx) => (
                        <div key={idx} className="mb-2 p-2 bg-red-50 rounded">
                          <div className="font-medium text-red-800">{err.error}</div>
                          <div className="text-gray-600">{JSON.stringify(err.row)}</div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>

          {/* Books Upload */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upload Books</h2>
            <p className="text-sm text-gray-600 mb-4">
              Expected columns: code, title, locationId, deleted (optional)
            </p>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setBooksFile(e.target.files?.[0] || null)}
              className="mb-4 w-full"
            />

            <button
              onClick={handleBooksUpload}
              disabled={!booksFile || uploading === 'books'}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading === 'books' ? 'Uploading...' : 'Upload Books'}
            </button>

            {booksResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="text-sm space-y-1">
                  <div className="text-green-600">✓ Success: {booksResult.success}</div>
                  <div className="text-red-600">✗ Failed: {booksResult.failed}</div>
                </div>
                {booksResult.errors.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-600">
                      View Errors ({booksResult.errors.length})
                    </summary>
                    <div className="mt-2 max-h-40 overflow-auto text-xs">
                      {booksResult.errors.map((err, idx) => (
                        <div key={idx} className="mb-2 p-2 bg-red-50 rounded">
                          <div className="font-medium text-red-800">{err.error}</div>
                          <div className="text-gray-600">{JSON.stringify(err.row)}</div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Note about Books Upload:</h3>
          <p className="text-sm text-blue-800">
            Books are upserted by their <code className="bg-blue-100 px-1 rounded">code</code> field.
            If a book with the same code exists, it will be updated. Otherwise, a new book will be created.
          </p>
        </div>
      </div>
    </Layout>
  );
}
