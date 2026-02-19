import type { Book } from '../types';
import Badge from './Badge';

interface BookSuggestionProps {
  book: Book;
  onClick: (book: Book) => void;
}

export default function BookSuggestion({ book, onClick }: BookSuggestionProps) {
  return (
    <li
      onClick={() => onClick(book)}
      className="p-4 hover:bg-gray-50 cursor-pointer"
    >
      <div className="font-medium">{book.title}</div>
      <div className="text-sm text-gray-600">
        <Badge content={book.code} type={"code"} /> {book.location?.name && <Badge content={book.location.name} type={"location"} />}
      </div>
    </li>
  );
}
