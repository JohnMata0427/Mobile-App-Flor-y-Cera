import { GRAY_COLOR_DARK } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export const Pagination = memo(
  ({ page, setPage, totalPages }: PaginationProps) => {
    return (
      <View style={styles.footerRow}>
        {page !== 1 && (
          <Pressable
            onPress={() => setPage(prev => prev - 1)}
            style={styles.paginationButton}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={20}
              color="white"
            />
          </Pressable>
        )}
        {page < totalPages && (
          <Pressable
            onPress={() => setPage(prev => prev + 1)}
            style={styles.paginationButton}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="white"
            />
          </Pressable>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paginationButton: {
    backgroundColor: GRAY_COLOR_DARK,
    borderRadius: 5,
    padding: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: 'black',
  },
});
