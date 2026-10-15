import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getCategory } from '../constants/categories';
import { formatCurrency, formatTime, formatDate, getDateLabel } from '../utils/helpers';

const TransactionItem = ({ item, onEdit, onDelete, theme }) => {
  const isIncome = item.type === 'income';
  const cat = getCategory(item.category);
  const label = getDateLabel(item.date);
  const when =
    label === 'Earlier' ? formatDate(item.date) : formatTime(item.date);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onEdit(item)}
      style={[
        styles.item,
        { backgroundColor: theme.card, borderLeftColor: cat.color },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: cat.color + '33' }]}>
        <Text style={styles.icon}>{cat.icon}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.sub, { color: theme.subText }]}>
          {item.category} • {when}
        </Text>
      </View>

      <Text
        style={[styles.amount, { color: isIncome ? theme.income : theme.expense }]}
      >
        {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
      </Text>

      <TouchableOpacity onPress={() => onDelete(item)} style={styles.delBtn}>
        <Text style={[styles.delText, { color: theme.subText }]}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderLeftWidth: 5,
    padding: 10,
    marginBottom: 8,
    elevation: 2,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '600' },
  sub: { fontSize: 12, marginTop: 2 },
  amount: { fontSize: 14, fontWeight: 'bold', marginHorizontal: 8 },
  delBtn: { padding: 6 },
  delText: { fontSize: 18 },
});

export default TransactionItem;