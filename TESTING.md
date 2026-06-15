# Manual Testing Guide

## Test Accounts to Create in Frappe

| Role | Email | Password | Notes |
|---|---|---|---|
| Librarian | librarian@lib.com | any password | Assign "Librarian" role in Frappe User |
| Assistant | assistant@lib.com | any password | Assign "Assistant" role in Frappe User |
| Bronze Member | bronze@test.com | any password | Create Library Member with tier Bronze |
| Silver Member | silver@test.com | any password | Create Library Member with tier Silver |
| Gold Member | gold@test.com | any password | Create Library Member with tier Gold |

---

## 1. Login & Roles

| Test | Steps | Expected |
|---|---|---|
| Librarian login | Email + password for librarian | See full sidebar: Dashboard, Catalog, Members, Requests, Reservations, Loans |
| Assistant login | Email + password for assistant | Sidebar shows "Limited access" badge; no book add/edit/delete; no member edit/delete |
| Member login | Member email + password | See member portal with Browse, Saved Books, My Loans, Membership tabs |
| Invalid login | Wrong email or password | Error message shown |

---

## 2. Book Catalog (Librarian)

| Test | Steps | Expected |
|---|---|---|
| Browse books | Click Catalog tab | Books displayed with cover, title, author, genre |
| Search | Type in search bar | Filters by title/author |
| Genre filter | Click genre pill | Only books of that genre shown |
| Add book | Click "+" → fill form → Submit | New book appears, synced to Frappe |
| Edit book | Hover book → click pencil → change title → Save | Updates in list and Frappe |
| Delete book | Hover book → click trash → confirm OK | Removed from list and Frappe |

---

## 3. Members (Librarian/Assistant)

| Test | Steps | Expected |
|---|---|---|
| View members | Click Members tab | Member list with avatar, name, tier, status |
| Search members | Type in search bar | Filters by name/email |
| Add member (librarian) | Click "+" → fill form → Submit | New member appears + Frappe user created |
| Add member (assistant) | Same | Should work (assistant can add members) |
| Edit member (librarian) | Hover member → click pencil → change tier → Save | Tier updates in list and Frappe |
| Edit member (assistant) | Same | Pencil should NOT show |
| Delete member | Hover → click trash → confirm | Removed |
| Member card hover | Hover a member row | Edit/delete buttons fade in on right |

---

## 4. Borrow/Return Flow

| Test | Steps | Expected |
|---|---|---|
| Member borrow request | Log in as member → find a book → click "Borrow" | Request appears in Pending Requests (librarian view) |
| Approve borrow | Log in as librarian → Requests tab → Approve | Loan created in Loans tab; member sees active loan |
| Reject borrow | Librarian → Reject | Status changes to Rejected |
| Request return | Member → My Loans → click "Return" | Return request appears in librarian Requests |
| Confirm return | Librarian → Requests → Confirm Return | Loan marked returned; if overdue → fine auto-created |

---

## 5. Renewals & Limits

| Test | Steps | Expected |
|---|---|---|
| Renew loan | Member → My Loans → click Renew (on active loan) | Due date extended by tier period |
| Renewal limit reached | Try renewing beyond max (Bronze=1, Silver=2) | Toast error: "Renewal limit reached" |
| Borrow limit check | Try to borrow 4 books as Bronze (max 3) | Toast error: "Limit reached" |
| Overdue renewal | Try renewing an overdue loan | Renew button hidden/disabled |

---

## 6. Reservations

| Test | Steps | Expected |
|---|---|---|
| Reserve (Silver/Gold) | As Silver/Gold member → click book that's all borrowed out → click Reserve | Reservation created |
| Reserve (Bronze) | As Bronze → same book | Reserve button should NOT show |
| Priority queue | Silver reserves Normal, Gold reserves Priority for same book | Gold shows as Priority in Reservations tab |
| Return triggers queue | Librarian confirms return on a reserved book | Toast shows "Reservation queue — X waiting" |

---

## 7. Saved Books

| Test | Steps | Expected |
|---|---|---|
| Save a book | As member → click heart on any book | Heart turns red; toast "Book saved" |
| View saved | Click "Saved Books" tab | Lists saved books, grouped by available/unavailable |
| Remove saved | Click heart again | Book removed; toast shown |
| Refresh persistence | Save a book → refresh page → check Saved tab | Still there |

---

## 8. Fines — Input Data & Testing

### Fine Rate Table

| Tier | Daily Overdue Rate |
|---|---|
| Bronze | $0.50/day |
| Silver | $0.25/day |
| Gold | $0.00/day (free) |

### Test 1: Bronze Overdue Fine

**Setup:**
1. Log in as Librarian → approve a borrow for Bronze member, due date set automatically (21 days from now)
2. Log in as Bronze member → wait until due date passes (or ask librarian to manually edit the loan's `due_date` in Frappe to a past date, e.g. 5 days ago)
3. Click "Return" on the overdue loan

**Expected:**
- Librarian sees Return Request with "Awaiting Confirmation"
- Librarian clicks "Confirm Return"
- Toast appears: "Overdue fine: $2.50" (5 days × $0.50)
- Fine appears in member's Membership tab → Fines section

### Test 2: Silver Overdue Fine

**Setup:**
1. Same as Test 1 but with Silver member
2. Set due date 10 days in the past

**Expected:**
- Fine = $2.50 (10 days × $0.25)

### Test 3: Gold Overdue (No Fine)

**Setup:**
1. Same flow with Gold member
2. Set due date 30 days in the past

**Expected:**
- Fine = $0.00 (Gold = free)
- No fine toast
- Loan returned successfully

### Test 4: On-Time Return (No Fine)

**Setup:**
1. Approve a borrow for any member
2. Member returns the book BEFORE the due date

**Expected:**
- Return confirmed
- No fine generated
- Toast just shows "Return confirmed"

### How to Manually Set a Past Due Date in Frappe

If you can't wait for real time to pass, go to your Frappe backend:
1. Open **Library Loan** doctype
2. Find the active loan
3. Edit the `due_date` field to a past date (e.g., if today is June 15, set it to June 10)
4. Save
5. Now the loan will be "overdue" when the member tries to return it

---

## 9. Tiers

| Test | Steps | Expected |
|---|---|---|
| Check limits | Member → Membership tab | Shows borrow limit bar (used/max) |
| Upgrade member | Librarian → edit member → change tier to Gold | Tier updates; member sees new limits on next load |
| Upgrade button | Member → Membership tab | Shows "Visit the library to upgrade" toast (read-only) |

---

## 10. Dashboard (Librarian)

| Test | Steps | Expected |
|---|---|---|
| View stats | Click Dashboard tab | Cards show totals; charts render |
| Genre chart | Dashboard | Pie chart of books by genre |
| Monthly chart | Dashboard | Bar chart of borrowed/returned by month |
| Recent activity | Dashboard | Lists recent borrows/returns |

---

## 11. Search & Filters

| Test | Steps | Expected |
|---|---|---|
| Search requests | Requests tab → type in search bar | Filters borrow/return requests by title, author, member name |
| Date filter requests | Requests tab → pick a date | Only requests matching that date shown |
| Clear date filter | Click "Clear" button | All requests shown again |
