import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const UndoToast = ({ visible, message, onUndo, theme }) => {
  if (!visible) return null;
  return (
    <View
      style={[
        styles.toast,
        { backgroundColor: theme.name === 'dark' ? '#f3f4f6' : '#1c1c1e' },
      ]}
    >
      <Text
        style={{
          color: theme.name === 'dark' ? '#1c1c1e' : '#fff',
          flex: 1,
        }}
      >
        {message}
      </Text>
      <TouchableOpacity onPress={onUndo}>
        <Text style={[styles.undo, { color: theme.primary }]}>UNDO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    elevation: 6,
  },
  undo: { fontWeight: 'bold', marginLeft: 16 },
});

export default UndoToast;