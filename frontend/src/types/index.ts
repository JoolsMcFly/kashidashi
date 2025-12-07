export type User = {
  id: number;
  email: string;
  firstname: string | null;
  surname: string | null;
  roles: string;
  locationId: number | null;
};

export type Location = {
  id: number;
  name: string | null;
};

export type Book = {
  id: number;
  code: number;
  title: string | null;
  locationId: number | null;
  location?: Location;
  loans?: Loan[];
  deleted: number | null;
};

export type Borrower = {
  id: number;
  firstname: string | null;
  surname: string;
  katakana: string;
  frenchSurname: string;
  loans?: Loan[];
};

export type Loan = {
  id: number;
  borrowerId: number;
  borrower: Borrower;
  bookId: number;
  book: Book;
  creatorId: number | null;
  creator: User;
  startedAt: string;
  stoppedAt: string | null;
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

export type Inventory = {
  id: number;
  startedAt: string;
  stoppedAt: string | null;
  bookCount: number;
  availableBookCount: number;
  items?: InventoryItem[];
};

export type InventoryItem = {
  id: number;
  inventoryId: number;
  bookId: number;
  book: Book;
  foundAtId: number;
  foundAt: Location;
  belongsAtId: number | null;
  belongsAt: Location | null;
};
