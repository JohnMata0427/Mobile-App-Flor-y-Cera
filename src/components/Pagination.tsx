import {
  GRAY_COLOR,
  GRAY_COLOR_DARK,
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
} from '@/constants/Colors';
import { BOLD_BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PaginationProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export const Pagination = memo(({ page, setPage, totalPages }: PaginationProps) => {
  return (
    <View style={styles.footerRow}>
      <Pressable
        onPress={() => setPage(prev => prev - 1)}
        disabled={page === 1}
        style={[
          styles.paginationButton,
          page === 1 ? styles.iconDisabledButtons : styles.iconButtons,
        ]}
      >
        <MaterialCommunityIcons name="chevron-left" size={20} color="white" />
      </Pressable>
      {Array.from({ length: totalPages }, (_, index) => (
        <Pressable
          key={index}
          onPress={() => setPage(index + 1)}
          disabled={page === index + 1}
          style={[
            styles.paginationButton,
            {
              backgroundColor: page === index + 1 ? PRIMARY_COLOR : GRAY_COLOR_DARK,
              borderColor: page === index + 1 ? PRIMARY_COLOR_DARK : 'black',
            },
          ]}
        >
          <Text style={styles.paginationText}>{index + 1}</Text>
        </Pressable>
      ))}
      <Pressable
        onPress={() => setPage(prev => prev + 1)}
        disabled={page === totalPages}
        style={[
          styles.paginationButton,
          page === totalPages ? styles.iconDisabledButtons : styles.iconButtons,
        ]}
      >
        <MaterialCommunityIcons name="chevron-right" size={20} color="white" />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: 10,
    backgroundColor: 'white',
    paddingVertical: 5,
    borderRadius: 10,
  },
  paginationButton: {
    borderRadius: 5,
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  iconButtons: {
    backgroundColor: GRAY_COLOR_DARK,
    borderColor: 'black',
  },
  iconDisabledButtons: {
    backgroundColor: GRAY_COLOR,
    borderColor: GRAY_COLOR_DARK,
  },
  paginationText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
  },
});
