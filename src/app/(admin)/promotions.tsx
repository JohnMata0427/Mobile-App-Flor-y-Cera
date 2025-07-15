import { AdminHeader } from '@/components/AdminHeader';
import { AdminSearch } from '@/components/AdminSearch';
import { Button } from '@/components/Button';
import { PromotionCard } from '@/components/cards/PromotionCard';
import { Loading } from '@/components/Loading';
import { PromotionModal } from '@/components/modals/PromotionModal';
import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_EXTRA_LIGHT,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { PromotionsContext, PromotionsProvider } from '@/contexts/PromotionsContext';
import { globalStyles } from '@/globalStyles';
import { Promotion } from '@/interfaces/Promotion';
import { showConfirmationAlert } from '@/utils/showAlert';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, use, useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Action = 'Agregar' | 'Actualizar';

const RenderItem = memo(
  ({
    item,
    showDeleteAlert,
    setAction,
    setModalVisible,
    setSelectedPromotion,
  }: {
    item: Promotion;
    showDeleteAlert: (_id: string) => void;
    setAction: (action: Action) => void;
    setModalVisible: (visible: boolean) => void;
    setSelectedPromotion: (promotion: Promotion) => void;
  }) => {
    const { _id } = item;

    return (
      <PromotionCard data={item}>
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => {
              setAction('Actualizar');
              setModalVisible(true);
              setSelectedPromotion(item);
            }}
            style={styles.actionButton}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => showDeleteAlert(_id)}>
            <MaterialCommunityIcons name="trash-can" size={20} color="white" />
          </Pressable>
        </View>
      </PromotionCard>
    );
  },
);

const Promotions = memo(function Promotions() {
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState<Action>('Agregar');
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const {
    searchedPromotions,
    loading,
    refreshing,
    setRefreshing,
    setSearch,
    getPromotions,
    deletePromotion,
  } = use(PromotionsContext);

  const showDeleteAlert = useCallback(
    (_id: string) => {
      showConfirmationAlert({
        message:
          '¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.',
        onConfirm: () => deletePromotion(_id),
        confirmButtonText: 'Eliminar',
      });
    },
    [deletePromotion],
  );

  return (
    <ScrollView
      contentContainerStyle={globalStyles.scrollViewContent}
      stickyHeaderIndices={[1]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await getPromotions();
          }}
          colors={[PRIMARY_COLOR, SECONDARY_COLOR, TERTIARY_COLOR]}
        />
      }
    >
      <AdminHeader>
        <Button
          label="Nueva promoción"
          icon="plus"
          onPress={() => {
            setAction('Agregar');
            setModalVisible(true);
            setSelectedPromotion(undefined);
          }}
          buttonStyle={styles.headerButton}
          textStyle={styles.headerButtonText}
        />
      </AdminHeader>

      <View style={styles.stickyHeader}>
        <AdminSearch setSearch={setSearch} placeholder="Buscar promoción por nombre..." />
      </View>

      <PromotionModal
        data={selectedPromotion}
        action={action}
        isVisible={modalVisible}
        setIsVisible={setModalVisible}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={searchedPromotions}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={({ _id }) => _id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <RenderItem
              item={item}
              showDeleteAlert={showDeleteAlert}
              setAction={setAction}
              setModalVisible={setModalVisible}
              setSelectedPromotion={setSelectedPromotion}
            />
          )}
          ListEmptyComponent={
            <View style={globalStyles.centeredContainer}>
              <MaterialCommunityIcons name="ticket-percent-outline" size={30} />
              <Text style={globalStyles.bodyText}>
                No se encontraron promociones, intente más tarde.
              </Text>
            </View>
          }
        />
      )}
    </ScrollView>
  );
});

export default function AdminPromotions() {
  return (
    <PromotionsProvider>
      <Promotions />
    </PromotionsProvider>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: PRIMARY_COLOR_EXTRA_LIGHT,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  listContent: {
    rowGap: 10,
    paddingHorizontal: 15,
  },
  actionRow: {
    flexDirection: 'row',
    columnGap: 5,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: SECONDARY_COLOR,
    borderRadius: 5,
    padding: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: SECONDARY_COLOR_DARK,
  },
  deleteButton: {
    backgroundColor: TERTIARY_COLOR,
    borderRadius: 5,
    padding: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: TERTIARY_COLOR_DARK,
  },
  headerButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  headerButtonText: {
    fontSize: 12,
  },
});