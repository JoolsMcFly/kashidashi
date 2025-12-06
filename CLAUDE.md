# Claude Notes - Kashidashi v2

## Project Context

Book lending management system for tracking books, borrowers, and loans.

## Key Requirements

- **Mobile-first** responsive design
- **Admin users**: Upload XLSX files for borrowers and books
- **Regular users**: Search and manage loans
- **Borrower search**: By katakana or frenchSurname
- **Book search**: By code with autocomplete
- **Loan tracking**: History with start and return dates
- **Book upsert**: Use `code` field as truth when uploading XLSX

## Data Model

```
borrowers (individuals/families)
  - firstname, lastname, katakana, frenchSurname

books
  - title, code (unique identifier), location, deleted

loans
  - borrower_id, book_id, start_date, return_date
```

## Tech Stack

- Backend: NestJS + TypeORM + MariaDB
- Frontend: React + TypeScript + Vite + TailwindCSS
- XLSX: SheetJS
- Node.js: v22

## Current Status

Planning phase - awaiting approval to begin implementation.