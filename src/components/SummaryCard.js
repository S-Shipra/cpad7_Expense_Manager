import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '../utils/helpers';

const SummaryCard = ({ balance, income, expense, theme }) => (
  <View style={[styles.card, { backgroundColor: theme.card }]}>
    <Text style={[styles.label, { color: theme.subText }]}>Total Balance</Text>
    <Text
      style={[
        styles.balance,
        { color: balance < 0 ? theme.expense : theme.text },
      ]}
    >
      {formatCurrency(balance)}
    </Text>

    <View style={styles.row}>
      <View style={styles.box}>
        <Text style={[styles.label, { color: theme.subText }]}>⬇ Income</Text>
        <Text style={[styles.value, { color: theme.income }]}>
          {formatCurrency(income)}
        </Text>
      </View>
      <View style={styles.box}>
        <Text style={[styles.label, { color: theme.subText }]}>⬆ Expense</Text>
        <Text style={[styles.value, { color: theme.expense }]}>
          {formatCurrency(expense)}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, marginBottom: 14, elevation: 3 },
  label: { fontSize: 13 },
  balance: { fontSize: 32, fontWeight: 'bold', marginVertical: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  box: { flex: 1 },
  value: { fontSize: 17, fontWeight: '600', marginTop: 2 },
});

export default SummaryCard;