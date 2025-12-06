# Kashidashi v2 - Book Lending Management System

## Tech Stack

**Frontend:**
- React with TypeScript
- Vite
- TailwindCSS (mobile-first)
- React Router
- SheetJS (xlsx)

**Backend:**
- NestJS with TypeScript
- TypeORM
- MariaDB

**Infrastructure:**
- Docker Compose (local dev)
- Node.js v22

## Database Schema

- [x] locations (id, name)
- [x] books (id, code, title, location_id, deleted)
- [x] borrowers (id, firstname, lastname, katakana, frenchSurname)
- [x] users (id, username, password_hash, is_admin, firstname, lastname, location_id)
- [x] loans (id, borrower_id, book_id, start_date, return_date)

## Implementation Steps

### 1. Project Setup
- [x] Create docker-compose.yml (MariaDB, backend, frontend)
- [x] Initialize NestJS backend
- [x] Initialize React + Vite frontend
- [x] Configure TypeORM with entities

### 2. Backend API

#### Authentication & User Management
- [x] Authentication (admin vs regular users)
- [x] Admin: Create user
- [x] Admin: List users
- [x] Admin: Update user
- [x] Admin: Delete user
- [x] Admin: Set/reset user password

#### XLSX Upload
- [x] Upload borrowers XLSX
- [x] Upload books XLSX (upsert by code)

#### Search & Data Retrieval
- [x] Search borrowers by katakana or frenchSurname
- [x] Search books by code (with autocomplete)
- [x] Get borrower by ID (with active loans)
- [x] Get book by ID/code (with current loan and borrow count)
- [x] Get loan history

#### Loan Management
- [x] Create loan (checkout book)
- [x] Return book (update loan return_date)

### 3. Frontend - Admin Panel
- [x] Admin login
- [x] User management (CRUD + password reset)
- [x] Upload borrowers XLSX
- [x] Upload books XLSX

### 4. Frontend - User Interface
- [x] User login
- [x] Search page (borrower or book search)
- [x] Borrower details page (with URL routing: `/borrower/:id`)
  - [x] Display borrower info
  - [x] Book search autocomplete
  - [x] Active loans list
  - [x] Swipe/click to return book
  - [x] Loan history
- [x] Book details page (with URL routing: `/book/:id` or `/book/:code`)
  - [x] Book information
  - [x] Current loan status
  - [x] Total borrow count

### 5. Mobile Optimization
- [x] Responsive design (mobile-first)
- [x] Touch-friendly interactions
- [ ] Swipe gestures for returns

## Notes

- Books are identified by `code` field for upsert operations
- Borrowers table represents individuals/families
- Deleted books are soft-deleted (deleted=true)
- URL routing ensures page refresh maintains current view
- Docker Compose for easy local development setup
- Users have firstname, lastname, and are associated with a location