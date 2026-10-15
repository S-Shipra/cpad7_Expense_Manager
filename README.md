# 💰 Expense Manager (React Native)

A feature-rich Expense Manager mobile app built with **React Native** and **Expo**. The UI is composed entirely of reusable widgets (components). Users can record income and expenses, categorise them, track a monthly budget, and view spending reports, with all data saved on the device.

Built as part of the Mobile Application Development lab (Experiment 7: *Expense Manager Application using Widgets in React Native*).

---

## ✨ Features

- **Add income and expense** transactions with separate income and expense categories
- **Categories with icons and colours** (Food 🍔, Travel ✈️, Shopping 🛍️, Bills 💡, Salary 💼 and more)
- **Running balance** with total income and total expense
- **Edit** any transaction by tapping it
- **Delete with Undo** via a toast message
- **Input validation** with an "Invalid input" alert
- **Monthly budget bar** that turns green, amber (80%+) or red (exceeded), with alerts
- **Category-wise spending chart** built from plain `View` widgets
- **Monthly report** with month navigation, savings rate, top categories and comparison with the previous month
- **Search and filters** by title, type, category and date (Today, Last 7 days, This month)
- **Grouped list** (Today / Yesterday / Earlier)
- **Dark mode** toggle
- **Persistent storage** with AsyncStorage, so data stays after the app is closed
- **Indian currency formatting** (₹ 1,23,456.00)

---

## 🛠️ Tech Stack

| Technology | Use |
|---|---|
| React Native | Mobile UI framework |
| Expo / Expo Go | Development and testing on a device |
| JavaScript (ES6+) | Language |
| AsyncStorage | Saving data on the device |
| React Hooks | `useState`, `useEffect`, `useRef`, `useColorScheme` |

---

## 🧩 Custom Widgets

| Widget | Purpose |
|---|---|
| `SummaryCard` | Shows total balance, income and expense |
| `CategoryChip` | Selectable category button with icon and colour |
| `AddForm` | Form to add a transaction (also used for editing) |
| `TransactionItem` | One list row with category icon, amount and delete button |
| `BudgetBar` | Sets the monthly budget and shows a colour-changing progress bar |
| `MonthlyReport` | Month-wise income, expense, savings and top categories |
| `FilterBar` | Search box with type, date and category filters |
| `ChartCard` | Category-wise spending bars |
| `ThemeToggle` | Light and dark mode switch |
| `UndoToast` | "Deleted. UNDO" message |
| `App` | Root widget that holds state and connects everything |

---

## 📁 Project Structure

```
ExpenseManager/
├── App.js
├── package.json
└── src/
    ├── components/
    │   ├── SummaryCard.js
    │   ├── CategoryChip.js
    │   ├── AddForm.js
    │   ├── TransactionItem.js
    │   ├── BudgetBar.js
    │   ├── MonthlyReport.js
    │   ├── FilterBar.js
    │   ├── ChartCard.js
    │   ├── ThemeToggle.js
    │   └── UndoToast.js
    ├── constants/
    │   ├── categories.js
    │   └── themes.js
    └── utils/
        ├── storage.js
        └── helpers.js
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version) and npm
- [Expo Go](https://expo.dev/go) app on your phone (or an Android Studio emulator)
- Git and a code editor such as Visual Studio Code

### Run the project

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 2. Go into the project folder
cd YOUR_REPO_NAME

# 3. Install dependencies
npm install

# 4. Start the development server
npx expo start
```

Then scan the QR code with **Expo Go** (your phone and computer must be on the same Wi-Fi network). Press `a` in the terminal to open an Android emulator instead.

> If the QR code does not connect, try `npx expo start --tunnel`.

### Build it from scratch

```bash
npx create-expo-app@latest expense-manager --template blank
cd expense-manager
npx expo install @react-native-async-storage/async-storage
```

Then copy `App.js` and the `src` folder into the project and run `npx expo start`.

---

## 📱 How to Use

1. Choose **Income** or **Expense**, enter a title and amount, pick a category and tap **Add Transaction**.
2. Watch the balance, chart, budget bar and monthly report update automatically.
3. Tap a transaction to **edit** it, or tap **✕** to delete it (use **UNDO** to bring it back).
4. Set a **monthly budget** to get warnings at 80% and when it is exceeded.
5. Use the **search box and filters** to find specific transactions.
6. Switch between **light and dark mode** with the toggle at the top.

---

## 🧠 Concepts Demonstrated

- Building a UI from reusable widgets (components)
- State management with `useState` and side effects with `useEffect`
- Props and callback functions for parent-child communication (lifting state up)
- Efficient lists with `FlatList`, using `ListHeaderComponent` and `ListEmptyComponent`
- Flexbox layout and light/dark theming through props
- Data persistence with AsyncStorage
- Array methods (`filter`, `reduce`, `map`, `sort`) and derived data

---

## 🔮 Future Scope

- Recurring transactions (rent, subscriptions, salary)
- Custom date range picker for filters
- Export data to CSV and share summaries
- Charts using a library (pie and line charts)
- Multi-screen navigation with React Navigation
- Biometric lock for privacy
- Cloud backup and sync

---

## 👤 Author

**Shipra Singh**
Roll No: 231071069 | Class: LY BTECH COMPS 
