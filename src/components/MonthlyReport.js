import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getMonthReport, monthLabel, formatCurrency } from '../utils/helpers';
import { getCategory } from '../constants/categories';

const MonthlyReport = ({ transactions, theme }) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  // delta = -1 (previous month) or +1 (next month); cannot go past this month
  const shiftMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    if (d > new Date(now.getFullYear(), now.getMonth(), 1)) return;
    setYear(d.getFullYear());
    setMonth(d.getMonth());
  };

  const r = getMonthReport(transactions, year, month);

  let changeText = 'No spending last month to compare with.';
  let changeColor = theme.subText;
  if (r.expenseChange !== null) {
    const pct = Math.abs(r.expenseChange).toFixed(0);
    if (Math.abs(r.expenseChange) < 0.5) {
      changeText = 'Spending is the same as last month.';
    } else if (r.expenseChange > 0) {
      changeText = `⬆ ${pct}% more spending than last month`;
      changeColor = theme.expense;
    } else {
      changeText = `⬇ ${pct}% less spending than last month`;
      changeColor = theme.income;
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Monthly Report</Text>

      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => shiftMonth(-1)} style={styles.arrow}>
          <Text style={[styles.arrowText, { color: theme.primary }]}>◀</Text>
        </TouchableOpacity>
        <Text style={[styles.month, { color: theme.text }]}>
          {monthLabel(year, month)}
        </Text>
        <TouchableOpacity
          onPress={() => shiftMonth(1)}
          style={styles.arrow}
          disabled={isCurrentMonth}
        >
          <Text
            style={[
              styles.arrowText,
              { color: isCurrentMonth ? theme.border : theme.primary },
            ]}
          >
            ▶
          </Text>
        </TouchableOpacity>
      </View>

      {r.count === 0 ? (
        <Text style={{ color: theme.subText, textAlign: 'center' }}>
          No transactions in this month.
        </Text>
      ) : (
        <>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.subText }]}>
                Income
              </Text>
              <Text style={[styles.statValue, { color: theme.income }]}>
                {formatCurrency(r.income)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.subText }]}>
                Expense
              </Text>
              <Text style={[styles.statValue, { color: theme.expense }]}>
                {formatCurrency(r.expense)}
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.subText }]}>
                Savings
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: r.savings < 0 ? theme.expense : theme.income },
                ]}
              >
                {formatCurrency(r.savings)}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.subText }]}>
                Savings rate
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {r.savingsRate === null ? '—' : `${r.savingsRate.toFixed(0)}%`}
              </Text>
            </View>
          </View>

          <Text style={[styles.change, { color: changeColor }]}>
            {changeText}
          </Text>

          {r.categories.length > 0 && (
            <View style={styles.topBox}>
              <Text style={[styles.statLabel, { color: theme.subText }]}>
                Top spending categories
              </Text>
              {r.categories.slice(0, 3).map((c, i) => {
                const cat = getCategory(c.name);
                return (
                  <View key={c.name} style={styles.topRow}>
                    <Text style={{ color: theme.text }}>
                      {i + 1}. {cat.icon} {c.name}
                    </Text>
                    <Text style={{ color: theme.subText }}>
                      {formatCurrency(c.total)}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          <Text style={[styles.count, { color: theme.subText }]}>
            {r.count} transaction{r.count === 1 ? '' : 's'} this month
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, marginBottom: 14, elevation: 3 },
  heading: { fontSize: 17, fontWeight: '700', marginBottom: 10 },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  arrow: { padding: 8 },
  arrowText: { fontSize: 18, fontWeight: 'bold' },
  month: { fontSize: 16, fontWeight: '600' },
  statsRow: { flexDirection: 'row', marginBottom: 10 },
  stat: { flex: 1 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  change: { fontSize: 13, fontWeight: '600', marginBottom: 10 },
  topBox: { marginTop: 4 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  count: { fontSize: 12, marginTop: 12, textAlign: 'right' },
});

export default MonthlyReport;