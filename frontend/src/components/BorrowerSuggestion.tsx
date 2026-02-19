import type { Borrower } from '../types';

interface BorrowerSuggestionProps {
  borrower: Borrower;
  onClick: (borrower: Borrower) => void;
}

export default function BorrowerSuggestion({ borrower, onClick }: BorrowerSuggestionProps) {
  return (
    <li
      onClick={() => onClick(borrower)}
      className="p-4 hover:bg-gray-50 cursor-pointer"
    >
      <div className="font-medium">
        {borrower.surname}
      </div>
      <div className="text-sm text-gray-600">
        {borrower.katakana} / {borrower.frenchSurname}
      </div>
    </li>
  );
}
