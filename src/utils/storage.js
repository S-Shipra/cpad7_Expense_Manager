import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'expense_manager_data_v1';

export const saveData = async (data) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.log('Save failed', e);
  }
};

export const loadData = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.log('Load failed', e);
    return null;
  }
};