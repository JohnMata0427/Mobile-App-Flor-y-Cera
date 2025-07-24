import { GRAY_COLOR_DARK } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type Dispatch, type SetStateAction } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface AdminSearchProps {
  setSearch: Dispatch<SetStateAction<string>>;
  placeholder?: string;
}

export const AdminSearch = memo(({ setSearch, placeholder = 'Buscar...' }: AdminSearchProps) => (
  <View>
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      onChangeText={text => setSearch(text)}
    />
    <Pressable style={styles.searchIcon}>
      <MaterialCommunityIcons name="magnify" size={20} color="white" />
    </Pressable>
  </View>
));

const styles = StyleSheet.create({
  searchInput: {
    borderRadius: 20,
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 70,
    fontSize: 12,
  },
  searchIcon: {
    position: 'absolute',
    insetBlock: 3,
    right: 3,
    justifyContent: 'center',
    backgroundColor: GRAY_COLOR_DARK,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
});
