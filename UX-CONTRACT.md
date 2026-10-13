# PandaBudget UI contract

The React frontend in `frontend/src` owns presentation. The Express API in `backend/src/index.ts` owns transaction and category writes. The current interface is English with baht amounts; native browser date and select popups follow the user's platform locale.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | `frontend/src/components/ui/select.tsx` | Native select with shared closed-state styling | Native only | Keyboard selection and open popup |
| Date | `frontend/src/components/ui/input.tsx` | Native date and month inputs | Date, month | Keyboard entry and browser picker |
| Form | `TransactionFormModal` and shared Input, Select, Button | Transaction API validation in `backend/src/index.ts` | Create, edit | Required fields, invalid amount, transfer destination |
| Scrollbar | `frontend/src/index.css` | Global thin scrollbar tokens | Native browser rendering | Long list and dialog scrolling |
| CRUD | `BudgetContext` mutations and route forms | Express API in `backend/src/index.ts` | Transaction, budget, category | Create, edit, delete, reload |

## Navigation and state

`Sidebar` and `BottomNav` share `navigation.ts`. The four main routes use the same month state where they show monthly budget data. The welcome route links to the dashboard. Financial values stay visible in text, including the category's available amount.

The theme switch is in the desktop sidebar, the mobile page header, and the welcome header. Its accessible label is "Dark mode" and its pressed state reports whether dark mode is on. First visit follows the operating system setting, then the choice persists locally across routes and reloads. All financial figures and chart legends remain text-readable in either theme.

## Data entry

Transaction categories are filtered by income or expense type. Transfer income requires an expense destination. A valid save updates the transaction query; the budget views derive available amounts from the selected month's transactions and saved limits. Native select and date popup geometry is intentionally platform owned.

## Accessibility and recovery

Navigation marks the current route. Icon controls have names. Keyboard focus is visible. Dialog contents scroll within the viewport. Invalid transaction fields retain their entered values and show a correction message. Mutation failure feedback remains an existing product limitation until a shared notification owner is added.
