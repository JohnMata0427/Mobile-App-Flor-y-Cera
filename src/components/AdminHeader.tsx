import { GRAY_COLOR_DARK } from '@/constants/Colors';
import { HEADING_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface AdminHeaderProps {
  children?: React.ReactNode;
  showSearchBar?: boolean;
}

export const AdminHeader = memo(
  ({ children, showSearchBar = true }: AdminHeaderProps) => {
    return (
      <>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image
              style={styles.iconImage}
              source={require('@/assets/images/icon.png')}
            />
            <Text style={styles.titleText}>Flor & Cera</Text>
          </View>
          {children}
        </View>
        {showSearchBar && (
          <View>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre..."
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
    paddingHorizontal: 15,
    borderRadius: 20,
  },
});
