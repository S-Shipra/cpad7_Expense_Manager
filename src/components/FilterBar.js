import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import CategoryChip from './CategoryChip';
import { ALL_CATEGORIES } from '../constants/categories';

const TYPES = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
];

const DATE_RANGES = [
  { key: 'all', label: 'All time' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Last 7 days' },
  { key: 'month', label: 'This month' },
];

/* Small pill button used for both the type and date rows */
const Pill = ({ label, active, onPress, theme }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.pill,
      {
        borderColor: theme.primary,
        backgroundColor: active ? theme.primary : 'transparent',
      },
    ]}
  >
    <Text style={{ color: active ? '#fff' : theme.text, fontWeight: '600' }}>
      {label}
    </Text>
  </TouchableOpacity>
);

const FilterBar = ({
  search,
  onSearch,
  typeFilter,
  onType,
  dateFilter,
  onDate,
  categoryFilter,
  onCategory,
  theme,
}) => (
  <View style={styles.wrap}>
    <TextInput
      style={[
        styles.search,
        {
          backgroundColor: theme.inputBg,
          borderColor: theme.border,
          color: theme.text,
        },
      ]}
      placeholder="🔍 Search transactions"
      placeholderTextColor={theme.subText}
      value={search}
      onChangeText={onSearch}
    />

    <Text style={[styles.rowLabel, { color: theme.subText }]}>Type</Text>
    <View style={styles.row}>
      {TYPES.map((t) => (
        <Pill
          key={t.key}
          label={t.label}
          active={typeFilter === t.key}
          onPress={() => onType(t.key)}
          theme={theme}
        />
      ))}
    </View>

    <Text style={[styles.rowLabel, { color: theme.subText }]}>Date</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
    >
      {DATE_RANGES.map((d) => (
        <Pill
          key={d.key}
          label={d.label}
          active={dateFilter === d.key}
          onPress={() => onDate(d.key)}
          theme={theme}
        />
      ))}
    </ScrollView>

    <Text style={[styles.rowLabel, { color: theme.subText }]}>Category</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <CategoryChip
        category={{ name: 'All', icon: '🔎', color: theme.primary }}
        selected={categoryFilter === 'All'}
        onPress={() => onCategory('All')}
        theme={theme}
      />
      {ALL_CATEGORIES.map((c) => (
        <CategoryChip
          key={c.name}
          category={c}
          selected={categoryFilter === c.name}
          onPress={() => onCategory(c.name)}
          theme={theme}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  rowLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  row: { flexDirection: 'row', marginBottom: 10, flexGrow: 0 },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 8,
  },
});

export default FilterBar;