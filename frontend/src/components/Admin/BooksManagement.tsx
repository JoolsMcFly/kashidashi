import UploadManagement from './UploadManagement';

export default function BooksManagement() {
  return (
    <UploadManagement
      config={{
        title: 'Books',
        icon: '📚',
        uploadEndpoint: '/upload/books',
        statsEndpoint: '/books/stats/count',
        expectedColumns: 'title, code, location, deleted',
        fileInputId: 'books-file-input',
        entityName: 'books',
        renderStats: (stats: { total: number; onLoan: number }) => (
          <p className="text-gray-600 text-sm">
            Total books: <strong>{stats.total}</strong> • On loan: <strong>{stats.onLoan}</strong>
          </p>
        ),
      }}
    />
  );
}
