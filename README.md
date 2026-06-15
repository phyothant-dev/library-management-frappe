# Library Management System

A full-featured library management application with a Frappe backend, role-based access control, tiered borrowing limits, and real Frappe authentication.

## Features

- **Role-based access**: Librarian (full CRUD), Assistant (limited access), Member (self-service)
- **Tiered borrowing**: Bronze (3 books, 21d, 1 renewal), Silver (5 books, 28d, 2 renewals + reservations), Gold (8 books, 35d, unlimited renewals + priority reservations)
- **Book catalog**: Browse, search, filter by genre; add/edit/delete books
- **Member management**: Add/edit/delete members with tier assignment
- **Borrow/return workflow**: Members request loans, librarian approves/confirms returns
- **Reservations**: Members can reserve unavailable books (Silver/Gold), priority queue
- **Renewals**: Renew active loans within tier limits
- **Fine tracking**: Overdue fine management
- **Dashboard**: Stats, charts (genre distribution, monthly activity), recent activity feed
- **Frappe integration**: Real backend with Library Book, Library Member, Library Loan, Library Reservation DocTypes

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
- **Backend**: Frappe (ERPNext)
- **Auth**: Frappe session-based login + API key for role lookup

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   VITE_FRAPPE_BASE_URL=https://your-frappe-instance.frappe.cloud
   VITE_FRAPPE_API_KEY=your_api_key
   VITE_FRAPPE_API_SECRET=your_api_secret
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Frappe DocTypes (5)

The following custom DocTypes are created on the Frappe instance:

| DocType | Type | Fields |
|---|---|---|
| **Library Book** | Master | title, author, genre, year, isbn, total_copies, available, rating, cover_url, description |
| **Library Member** | Master | member_name, email, phone, tier, status, avatar, expiry_date |
| **Library Loan** | Transaction | book, member, borrowed_date, due_date, returned_date, status, renewals |
| **Library Reservation** | Transaction | book, member, reserved_date, status, priority |
| **Library Fine** | Transaction | member, loan, amount, reason, status, fine_date |

## Roles

- **Librarian** — Full access to books, members, loans, and reservations
- **Assistant** — Can manage members (add only), approve/reject borrows, confirm returns; no book CRUD, no member edit/delete
- **Library Member** — Self-service portal: browse catalog, borrow/return requests, renewals, reservations, fines
