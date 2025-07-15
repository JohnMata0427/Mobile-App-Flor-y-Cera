import { TabLayout } from '@/components/TabLayout';
import { PRIMARY_COLOR_EXTRA_LIGHT } from '@/constants/Colors';
import { ADMIN_TABS } from '@/constants/Tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminLayout() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.layout, { paddingTop: top + 5 }]}>
      <TabLayout tabs={ADMIN_TABS} />
    </View>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
  },
});