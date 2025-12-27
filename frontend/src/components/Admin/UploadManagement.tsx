import { useState, useEffect } from 'react';
import api from '../../services/api';
import type { UploadResult } from '../../types';

interface UploadConfig {
  title: string;
  icon: string;
  uploadEndpoint: string;
  statsEndpoint: string;
  expectedColumns: string;
  fileInputId: string;
  entityName: string;
  renderStats: (stats: any) => React.ReactNode;
}

interface UploadManagementProps {
  config: UploadConfig;
}

export default function UploadManagement({ config }: UploadManagementProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await api.get(config.statsEndpoint);
      setStats(response.data);
    } catch (error) {
      console.error(`Error loading ${config.entityName} stats:`, error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<UploadResult>(config.uploadEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
      setFile(null);
      await loadStats();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to upload ${config.entityName}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4" style={{ color: '#111827' }}>
        {config.title}
      </h2>
      {stats && (
        <div className="mb-6 pb-6 border-b border-gray-200 text-center">
          {config.renderStats(stats)}
        </div>
      )}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
        style={{ borderColor: '#d1d5db' }}
        onClick={() => document.getElementById(config.fileInputId)?.click()}
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
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) setFile(droppedFile);
        }}
      >
        <div className="text-5xl mb-2">{config.icon}</div>
        <p className="text-gray-600 text-sm">
          {file ? file.name : 'Drop XLSX file here or click to browse'}
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Expected columns: {config.expectedColumns}
        </p>
        <input
          id={config.fileInputId}
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>
      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 px-6 py-3 text-white font-semibold rounded-lg disabled:opacity-50"
          style={{ background: '#667eea' }}
        >
          {uploading ? 'Uploading...' : `Upload ${config.title}`}
        </button>
      )}
      {result && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Uploaded: <strong>{result.success}</strong> • Failed: <strong>{result.failed}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
