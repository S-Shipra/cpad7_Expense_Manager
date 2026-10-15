export const EXPENSE_CATEGORIES = [
  { name: 'Food', icon: '🍔', color: '#f57c00' },
  { name: 'Travel', icon: '✈️', color: '#1e88e5' },
  { name: 'Shopping', icon: '🛍️', color: '#d81b60' },
  { name: 'Bills', icon: '💡', color: '#fbc02d' },
  { name: 'Health', icon: '💊', color: '#e53935' },
  { name: 'Entertainment', icon: '🎬', color: '#8e24aa' },
  { name: 'Other', icon: '📦', color: '#757575' },
];

export const INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', color: '#2e7d32' },
  { name: 'Freelance', icon: '💻', color: '#00897b' },
  { name: 'Gift', icon: '🎁', color: '#ec407a' },
  { name: 'Other Income', icon: '💰', color: '#6d4c41' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategory = (name) =>
  ALL_CATEGORIES.find((c) => c.name === name) || {
    name,
    icon: '📦',
    color: '#757575',
  };