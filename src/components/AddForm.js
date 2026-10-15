import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import CategoryChip from './CategoryChip';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';

/* Used for both adding a new transaction and editing an existing one */
const AddForm = ({ onSubmit, editingItem, onCancelEdit, theme }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const resetFields = () => {
    setTitle('');
    setAmount('');
    setType('expense');
    setCategory(EXPENSE_CATEGORIES[0].name);
  };

  // When an item is chosen for editing, fill the form with its values
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setAmount(String(editingItem.amount));
      setType(editingItem.type);
      setCategory(editingItem.category);
    } else {
      resetFields();
    }
  }, [editingItem]);

  const changeType = (newType) => {
    setType(newType);
    const list = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategory(list[0].name);
  };

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (title.trim() === '' || isNaN(value) || value <= 0) {
      Alert.alert(
        'Invalid input',
        'Enter a title and an amount greater than 0.'
      );
      return;
    }
    onSubmit({
      id: editingItem ? editingItem.id : Date.now().toString(),
      title: title.trim(),
      amount: value,
      type,
      category,
      date: editingItem ? editingItem.date : new Date().toISOString(),
    });
    resetFields();
  };

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text },
  ];

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        {editingItem ? 'Edit Transaction' : 'Add Transaction'}
      </Text>

      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[
            styles.typeBtn,
            { borderColor: theme.income },
            type === 'income' && { backgroundColor: theme.income },
          ]}
          onPress={() => changeType('income')}
        >
          <Text
            style={[
              styles.typeText,
              { color: type === 'income' ? '#fff' : theme.text },
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeBtn,
            { borderColor: theme.expense },
            type === 'expense' && { backgroundColor: theme.expense },
          ]}
          onPress={() => changeType('expense')}
        >
          <Text
            style={[
              styles.typeText,
              { color: type === 'expense' ? '#fff' : theme.text },
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={inputStyle}
        placeholder="Title (e.g. Lunch)"
        placeholderTextColor={theme.subText}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={inputStyle}
        placeholder="Amount"
        placeholderTextColor={theme.subText}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <View style={styles.chipRow}>
        {categories.map((c) => (
          <CategoryChip
            key={c.name}
            category={c}
            selected={category === c.name}
            onPress={() => setCategory(c.name)}
            theme={theme}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: theme.primary }]}
        onPress={handleSubmit}
      >
        <Text style={styles.addBtnText}>
          {editingItem ? 'Save Changes' : 'Add Transaction'}
        </Text>
      </TouchableOpacity>

      {editingItem && (
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancelEdit}>
          <Text style={{ color: theme.subText }}>Cancel edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, marginBottom: 14, elevation: 3 },
  heading: { fontSize: 17, fontWeight: '700', marginBottom: 10 },
  typeRow: { flexDirection: 'row', marginBottom: 10 },
  typeBtn: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  typeText: { fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  addBtn: { padding: 12, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { alignItems: 'center', marginTop: 10 },
});

export default AddForm;