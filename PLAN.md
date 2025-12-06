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

- [ ] locations (id, name)
- [ ] books (id, code, title, location_id, deleted)
- [ ] borrowers (id, firstname, lastname, katakana, frenchSurname)
- [ ] users (id, username, password_hash, is_admin, firstname, lastname, location_id)
- [ ] loans (id, borrower_id, book_id, start_date, return_date)

## Implementation Steps

### 1. Project Setup
- [ ] Create docker-compose.yml (MariaDB, backend, frontend)
- [ ] Initialize NestJS backend
- [ ] Initialize React + Vite frontend
- [ ] Configure TypeORM with entities

### 2. Backend API

#### Authentication & User Management
- [ ] Authentication (admin vs regular users)
- [ ] Admin: Create user
- [ ] Admin: List users
- [ ] Admin: Update user
- [ ] Admin: Delete user
- [ ] Admin: Set/reset user password

#### XLSX Upload
- [ ] Upload borrowers XLSX
- [ ] Upload books XLSX (upsert by code)

#### Search & Data Retrieval
- [ ] Search borrowers by katakana or frenchSurname
- [ ] Search books by code (with autocomplete)
- [ ] Get borrower by ID (with active loans)
- [ ] Get book by ID/code (with current loan and borrow count)
- [ ] Get loan history

#### Loan Management
- [ ] Create loan (checkout book)
- [ ] Return book (update loan return_date)

### 3. Frontend - Admin Panel
- [ ] Admin login
- [ ] User management (CRUD + password reset)
- [ ] Upload borrowers XLSX
- [ ] Upload books XLSX

### 4. Frontend - User Interface
- [ ] User login
- [ ] Search page (borrower or book search)
- [ ] Borrower details page (with URL routing: `/borrower/:id`)
  - [ ] Display borrower info
  - [ ] Book search autocomplete
  - [ ] Active loans list
  - [ ] Swipe/click to return book
  - [ ] Loan history
- [ ] Book details page (with URL routing: `/book/:id` or `/book/:code`)
  - [ ] Book information
  - [ ] Current loan status
  - [ ] Total borrow count

### 5. Mobile Optimization
- [ ] Responsive design (mobile-first)
- [ ] Touch-friendly interactions
- [ ] Swipe gestures for returns

## Notes

- Books are identified by `code` field for upsert operations
- Borrowers table represents individuals/families
- Deleted books are soft-deleted (deleted=true)
- URL routing ensures page refresh maintains current view
- Docker Compose for easy local development setup
- Users have firstname, lastname, and are associated with a location