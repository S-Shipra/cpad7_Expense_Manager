import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { formatCurrency } from '../utils/helpers';

const BudgetBar = ({ budget, spent, onSetBudget, theme }) => {
  const [input, setInput] = useState('');

  const ratio = budget > 0 ? spent / budget : 0;
  const percent = Math.round(ratio * 100);
  const barColor =
    ratio >= 1 ? theme.expense : ratio >= 0.8 ? theme.warning : theme.income;

  const handleSet = () => {
    const value = parseFloat(input);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid budget', 'Enter a budget greater than 0.');
      return;
    }
    onSetBudget(value);
    setInput('');
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.heading, { color: theme.text }]}>Monthly Budget</Text>

      {budget > 0 ? (
        <>
          <View style={[styles.track, { backgroundColor: theme.track }]}>
            <View
              style={[
                styles.fill,
                { width: `${Math.min(percent, 100)}%`, backgroundColor: barColor },
              ]}
            />
          </View>
          <Text style={[styles.status, { color: theme.subText }]}>
            {formatCurrency(spent)} of {formatCurrency(budget)} ({percent}%)
          </Text>
          {ratio >= 1 && (
            <Text style={{ color: theme.expense, fontWeight: '600', marginTop: 4 }}>
              ⚠ Budget exceeded by {formatCurrency(spent - budget)}
            </Text>
          )}
          {ratio >= 0.8 && ratio < 1 && (
            <Text style={{ color: theme.warning, fontWeight: '600', marginTop: 4 }}>
              ⚠ Over 80% of your budget used
            </Text>
          )}
        </>
      ) : (
        <Text style={[styles.status, { color: theme.subText }]}>
          No budget set. Set a monthly limit to track your spending.
        </Text>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.inputBg,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder={budget > 0 ? 'Change budget' : 'Set budget (₹)'}
          placeholderTextColor={theme.subText}
          keyboardType="numeric"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.primary }]}
          onPress={handleSet}
        >
          <Text style={styles.btnText}>Set</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, marginBottom: 14, elevation: 3 },
  heading: { fontSize: 17, fontWeight: '700', marginBottom: 10 },
  track: { height: 12, borderRadius: 6, overflow: 'hidden' },
  fill: { height: 12, borderRadius: 6 },
  status: { fontSize: 13, marginTop: 6 },
  inputRow: { flexDirection: 'row', marginTop: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  btn: {
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});

export default BudgetBar;