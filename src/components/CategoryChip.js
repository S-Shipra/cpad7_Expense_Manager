import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

/* category = { name, icon, color } */
const CategoryChip = ({ category, selected, onPress, theme }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      {
        borderColor: category.color,
        backgroundColor: selected ? category.color : 'transparent',
      },
    ]}
  >
    <Text style={[styles.text, { color: selected ? '#fff' : theme.text }]}>
      {category.icon} {category.name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 8,
  },
  text: { fontSize: 13, fontWeight: '500' },
});

export default CategoryChip;