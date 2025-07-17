import { GRAY_COLOR_DARK, GRAY_COLOR } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const ClientSearchBar = memo(() => (
  <View style={styles.searchInput}>
    <Text style={{ fontSize: 12, color: GRAY_COLOR }}>
      Jabón de miel natural...
    </Text>
    <Pressable style={styles.searchIcon}>
      <MaterialCommunityIcons name="magnify" size={20} color="white" />
    </Pressable>
  </View>
));

const styles = StyleSheet.create({
  searchInput: {
    borderRadius: 20,
    backgroundColor: 'white',
    height: 35,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  searchIcon: {
    position: 'absolute',
    insetBlock: 3,
    right: 3,
    justifyContent: 'center',
    backgroundColor: GRAY_COLOR_DARK,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    zIndex: 1,
  },
  flatList: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    zIndex: 1,
  },
  emptyComponentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  renderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  renderItemImage: {
    width: 25,
    height: 25,
    borderRadius: 5,
  },
  renderItemDetails: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
