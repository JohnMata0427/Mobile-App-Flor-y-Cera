import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { HEADING_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type Dispatch, type ReactNode } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface AdminHeaderProps {
  children?: ReactNode;
  showSearchBar?: boolean;
  setSearch?: Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

export const AdminHeader = memo(
  ({ children, showSearchBar = true, setSearch, placeholder }: AdminHeaderProps) => {
    return (
      <>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image style={styles.iconImage} source={require('@/assets/images/icon.png')} />
            <Text style={styles.titleText}>Flor & Cera</Text>
          </View>
          {children}
        </View>
        {showSearchBar && (
          <View>
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              onChangeText={text => setSearch && setSearch(text)}
            />
            <Pressable style={styles.searchIcon}>
              <MaterialCommunityIcons name="magnify" size={20} color="white" />
            </Pressable>
          </View>
        )}
      </>
    );
  },
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  titleText: {
    fontFamily: HEADING_FONT,
    fontSize: 18,
  },
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
