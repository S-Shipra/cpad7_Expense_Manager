import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCategory } from '../constants/categories';
import { formatCurrency } from '../utils/helpers';

/* data = [{ name, total }] sorted highest first. Bars are plain Views. */
const ChartCard = ({ data, theme }) => {
  const max = data.length > 0 ? data[0].total : 0;

  return (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <Text style={[styles.heading, { color: theme.text }]}>
        Spending by Category
      </Text>

      {data.length === 0 ? (
        <Text style={{ color: theme.subText }}>
          Add an expense to see your spending breakdown.
        </Text>
      ) : (
        data.map((d) => {
          const cat = getCategory(d.name);
          const width = max > 0 ? (d.total / max) * 100 : 0;
          return (
            <View key={d.name} style={styles.row}>
              <View style={styles.labelRow}>
                <Text style={{ color: theme.text }}>
                  {cat.icon} {d.name}
                </Text>
                <Text style={{ color: theme.subText }}>
                  {formatCurrency(d.total)}
                </Text>
              </View>
              <View style={[styles.track, { backgroundColor: theme.track }]}>
                <View
                  style={[
                    styles.fill,
                    { width: `${width}%`, backgroundColor: cat.color },
                  ]}
                />
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: 16, marginBottom: 14, elevation: 3 },
  heading: { fontSize: 17, fontWeight: '700', marginBottom: 10 },
  row: { marginBottom: 10 },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  track: { height: 10, borderRadius: 5, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 5 },
});

export default ChartCard;