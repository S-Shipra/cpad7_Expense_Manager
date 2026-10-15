/* ---------- Currency (Indian grouping: 1,23,456.00) ---------- */
export const formatCurrency = (n) => {
  const value = Number(n) || 0;
  const [intPart, dec] = Math.abs(value).toFixed(2).split('.');
  const last3 = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const grouped = rest
    ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3
    : last3;
  return `${value < 0 ? '-' : ''}₹ ${grouped}.${dec}`;
};

/* ---------- Dates ---------- */
const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const getDateLabel = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yesterday)) return 'Yesterday';
  return 'Earlier';
};

export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString([], {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const monthLabel = (year, month) =>
  new Date(year, month, 1).toLocaleDateString([], {
    month: 'long',
    year: 'numeric',
  });

/* Groups transactions by Today / Yesterday / Earlier (newest first) */
export const groupByDate = (transactions) => {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const map = { Today: [], Yesterday: [], Earlier: [] };
  sorted.forEach((t) => map[getDateLabel(t.date)].push(t));
  return ['Today', 'Yesterday', 'Earlier']
    .filter((label) => map[label].length > 0)
    .map((label) => ({ title: label, data: map[label] }));
};

/* ---------- Totals ---------- */
export const calcTotals = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expense, balance: income - expense };
};

/* Total expense in the current calendar month (used by the budget bar) */
export const monthlyExpense = (transactions) => {
  const now = new Date();
  return transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === 'expense' &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

/* ---------- Filtering ---------- */
/* dateRange: 'all' | 'today' | 'week' (last 7 days) | 'month' (this month) */
const matchDateRange = (iso, range) => {
  if (range === 'all') return true;
  const d = new Date(iso);
  const today = new Date();
  if (range === 'today') return sameDay(d, today);
  if (range === 'week') {
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    start.setDate(start.getDate() - 6);
    return d >= start;
  }
  if (range === 'month') {
    return (
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }
  return true;
};

export const filterTransactions = (
  transactions,
  { search = '', type = 'all', category = 'All', dateRange = 'all' }
) => {
  const q = search.trim().toLowerCase();
  return transactions.filter((t) => {
    const matchSearch = q === '' || t.title.toLowerCase().includes(q);
    const matchType = type === 'all' || t.type === type;
    const matchCategory = category === 'All' || t.category === category;
    const matchDate = matchDateRange(t.date, dateRange);
    return matchSearch && matchType && matchCategory && matchDate;
  });
};

/* ---------- Chart data: expense total per category, highest first ---------- */
export const spendingByCategory = (transactions) => {
  const totals = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
  return Object.keys(totals)
    .map((name) => ({ name, total: totals[name] }))
    .sort((a, b) => b.total - a.total);
};

/* ---------- Monthly report ---------- */
export const getMonthReport = (transactions, year, month) => {
  const inMonth = (t, y, m) => {
    const d = new Date(t.date);
    return d.getFullYear() === y && d.getMonth() === m;
  };

  const current = transactions.filter((t) => inMonth(t, year, month));
  const prevDate = new Date(year, month - 1, 1);
  const previous = transactions.filter((t) =>
    inMonth(t, prevDate.getFullYear(), prevDate.getMonth())
  );

  const cur = calcTotals(current);
  const prev = calcTotals(previous);
  const categories = spendingByCategory(current);

  return {
    count: current.length,
    income: cur.income,
    expense: cur.expense,
    savings: cur.balance,
    savingsRate: cur.income > 0 ? (cur.balance / cur.income) * 100 : null,
    categories,
    // % change in spending vs previous month (null if nothing to compare with)
    expenseChange:
      prev.expense > 0 ? ((cur.expense - prev.expense) / prev.expense) * 100 : null,
  };
};