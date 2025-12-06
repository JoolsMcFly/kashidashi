export type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
  locationId: number | null;
};

export type Location = {
  id: number;
  name: string;
};

export type Book = {
  id: number;
  code: string;
  title: string;
  locationId: number;
  location?: Location;
  deleted: boolean;
};

export type Borrower = {
  id: number;
  firstname: string;
  lastname: string;
  katakana: string;
  frenchSurname: string;
  loans?: Loan[];
};

export type Loan = {
  id: number;
  borrowerId: number;
  borrower?: Borrower;
  bookId: number;
  book?: Book;
  startDate: string;
  returnDate: string | null;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

export type UploadResult = {
  success: number;
  failed: number;
  errors: Array<{ row: any; error: string }>;
};
