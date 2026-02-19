import UploadManagement from './UploadManagement';

export default function BorrowersManagement() {
  return (
    <UploadManagement
      config={{
        title: 'Borrowers',
        icon: '📤',
        uploadEndpoint: '/upload/borrowers',
        downloadEndpoint: '/borrowers/download',
        statsEndpoint: '/borrowers/stats/count',
        expectedColumns: 'surname, katakana, frenchSurname',
        fileInputId: 'borrowers-file-input',
        entityName: 'borrowers',
        renderStats: (stats: { total: number }) => (
          <p className="text-gray-600 text-sm">
            Total borrowers: <strong>{stats.total}</strong>
          </p>
        ),
      }}
    />
  );
}
