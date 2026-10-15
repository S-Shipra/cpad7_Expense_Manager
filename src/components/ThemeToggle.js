import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const ThemeToggle = ({ isDark, onToggle, theme }) => (
  <View style={styles.row}>
    <Text style={[styles.label, { color: theme.subText }]}>
      {isDark ? '🌙' : '☀️'}
    </Text>
    <Switch
      value={isDark}
      onValueChange={onToggle}
      trackColor={{ false: '#bdbdbd', true: theme.primary }}
      thumbColor="#ffffff"
    />
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 18, marginRight: 4 },
});

export default ThemeToggle;