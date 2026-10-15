import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import SummaryCard from './src/components/SummaryCard';
import AddForm from './src/components/AddForm';
import TransactionItem from './src/components/TransactionItem';
import BudgetBar from './src/components/BudgetBar';
import MonthlyReport from './src/components/MonthlyReport';
import FilterBar from './src/components/FilterBar';
import ChartCard from './src/components/ChartCard';
import ThemeToggle from './src/components/ThemeToggle';
import UndoToast from './src/components/UndoToast';

import { lightTheme, darkTheme } from './src/constants/themes';
import { saveData, loadData } from './src/utils/storage';
import {
  monthlyExpense,
  filterTransactions,
  groupByDate,
  spendingByCategory,
  formatCurrency,
} from './src/utils/helpers';

export default function App() {
  const systemScheme = useColorScheme();

  /* ---------- State ---------- */
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [editingItem, setEditingItem] = useState(null);
  const [lastDeleted, setLastDeleted] = useState(null);

  const listRef = useRef(null);
  const toastTimer = useRef(null);

  const theme = isDark ? darkTheme : lightTheme;

  /* ---------- Load saved data once on start ---------- */
  useEffect(() => {
    (async () => {
      const data = await loadData();
      if (data) {
        setTransactions(data.transactions || []);
        setBudget(data.budget || 0);
        if (typeof data.isDark === 'boolean') setIsDark(data.isDark);
      }
      setLoaded(true);
    })();
  }, []);

  /* ---------- Save whenever data changes (after the first load) ---------- */
  useEffect(() => {
    if (loaded) saveData({ transactions, budget, isDark });
  }, [transactions, budget, isDark, loaded]);

  /* ---------- addTransaction: handles both a new entry and an edit ---------- */
  const addTransaction = (t) => {
    if (editingItem) {
      setTransactions((prev) => prev.map((x) => (x.id === t.id ? t : x)));
      setEditingItem(null);
      return;
    }

    // Budget warnings (only for new expenses)
    if (t.type === 'expense' && budget > 0) {
      const before = monthlyExpense(transactions);
      const after = before + t.amount;
      if (before < budget && after >= budget) {
        Alert.alert(
          'Budget exceeded',
          `You have crossed your monthly budget of ${formatCurrency(budget)}.`
        );
      } else if (before < budget * 0.8 && after >= budget * 0.8) {
        Alert.alert('Budget warning', 'You have used over 80% of your budget.');
      }
    }
    setTransactions((prev) => [t, ...prev]);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  /* ---------- deleteTransaction (with undo) ---------- */
  const deleteTransaction = (item) => {
    setTransactions((prev) => prev.filter((x) => x.id !== item.id));
    if (editingItem && editingItem.id === item.id) setEditingItem(null);

    setLastDeleted(item);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setLastDeleted(null), 4000);
  };

  const undoDelete = () => {
    if (lastDeleted) setTransactions((prev) => [lastDeleted, ...prev]);
    setLastDeleted(null);
    if (toastTimer.current) clearTimeout(toastTimer.current);
  };

  /* ---------- Derived data (recalculated on every render) ---------- */
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const spentThisMonth = monthlyExpense(transactions);
  const chartData = spendingByCategory(transactions);

  const filtered = filterTransactions(transactions, {
    search,
    type: typeFilter,
    category: categoryFilter,
    dateRange: dateFilter,
  });

  // Flatten the groups into one list for FlatList: header rows + transaction rows
  const listData = [];
  groupByDate(filtered).forEach((section) => {
    listData.push({ kind: 'header', title: section.title });
    section.data.forEach((t) => listData.push({ kind: 'transaction', data: t }));
  });

  const filtersActive =
    search.trim() !== '' ||
    typeFilter !== 'all' ||
    dateFilter !== 'all' ||
    categoryFilter !== 'All';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <FlatList
        ref={listRef}
        data={listData}
        keyExtractor={(item) =>
          item.kind === 'header' ? `header-${item.title}` : item.data.id
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) =>
          item.kind === 'header' ? (
            <Text style={[styles.sectionTitle, { color: theme.subText }]}>
              {item.title}
            </Text>
          ) : (
            <TransactionItem
              item={item.data}
              onEdit={startEdit}
              onDelete={deleteTransaction}
              theme={theme}
            />
          )
        }
        ListHeaderComponent={
          <View>
            <View style={styles.headerRow}>
              <Text style={[styles.heading, { color: theme.text }]}>
                Expense Manager
              </Text>
              <ThemeToggle
                isDark={isDark}
                onToggle={setIsDark}
                theme={theme}
              />
            </View>

            <SummaryCard
              balance={balance}
              income={income}
              expense={expense}
              theme={theme}
            />
            <BudgetBar
              budget={budget}
              spent={spentThisMonth}
              onSetBudget={setBudget}
              theme={theme}
            />
            <MonthlyReport transactions={transactions} theme={theme} />
            <ChartCard data={chartData} theme={theme} />
            <AddForm
              onSubmit={addTransaction}
              editingItem={editingItem}
              onCancelEdit={() => setEditingItem(null)}
              theme={theme}
            />

            <Text style={[styles.listHeading, { color: theme.text }]}>
              Transactions
            </Text>
            <FilterBar
              search={search}
              onSearch={setSearch}
              typeFilter={typeFilter}
              onType={setTypeFilter}
              dateFilter={dateFilter}
              onDate={setDateFilter}
              categoryFilter={categoryFilter}
              onCategory={setCategoryFilter}
              theme={theme}
            />
          </View>
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.subText }]}>
            {filtersActive
              ? 'No matching transactions.'
              : 'No transactions yet.'}
          </Text>
        }
      />

      <UndoToast
        visible={lastDeleted !== null}
        message={lastDeleted ? `Deleted "${lastDeleted.title}"` : ''}
        onUndo={undoDelete}
        theme={theme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heading: { fontSize: 24, fontWeight: 'bold' },
  listHeading: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    paddingVertical: 6,
    marginTop: 4,
  },
  empty: { textAlign: 'center', marginTop: 20 },
});