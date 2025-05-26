import { AdminHeader } from '@/components/AdminHeader';
import { Loading } from '@/components/Loading';
import { Pagination } from '@/components/Pagination';
import { PromotionCard } from '@/components/cards/PromotionCard';
import { PromotionModal } from '@/components/modals/PromotionModal';
import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
  TERTIARY_COLOR,
  TERTIARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import {
  PromotionsContext,
  PromotionsProvider,
} from '@/contexts/PromotionsContext';
import { Promotion } from '@/interfaces/Promotion';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use, useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Action = 'Agregar' | 'Actualizar';

function Promotions() {
  const [modalVisible, setModalVisible] = useState(false);
  const [action, setAction] = useState<Action>('Agregar');
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion>();
  const {
    promotions,
    loading,
    page,
    totalPages,
    refreshing,
    setRefreshing,
    setPage,
    getPromotions,
    deletePromotion,
  } = use(PromotionsContext);

  const showDeleteAlert = useCallback(
    (_id: string) => {
      Alert.alert(
        'Eliminar promoción',
        '¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => deletePromotion(_id),
          },
        ],
      );
    },
    [deletePromotion],
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
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
      <View style={styles.container}>
        <AdminHeader>
          <Pressable
            style={styles.addButton}
            onPress={() => {
              setAction('Agregar');
              setModalVisible(true);
              setSelectedPromotion(undefined);
            }}
          >
            <MaterialCommunityIcons name="plus" size={14} color="white" />
            <Text style={styles.addButtonText}>Nueva promoción</Text>
          </Pressable>
        </AdminHeader>
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
            data={promotions}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            keyExtractor={({ _id }) => _id}
            scrollEnabled={false}
            renderItem={({ item }) => {
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
                      <MaterialCommunityIcons
                        name="pencil"
                        size={20}
                        color="white"
                      />
                    </Pressable>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => showDeleteAlert(_id)}
                    >
                      <MaterialCommunityIcons
                        name="trash-can"
                        size={20}
                        color="white"
                      />
                    </Pressable>
                  </View>
                </PromotionCard>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="ticket" size={24} />
                <Text style={styles.emptyText}>
                  No se encontraron promociones, agregue una nueva
                </Text>
              </View>
            }
            ListHeaderComponent={
              <Pagination
                page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            }
          />
        )}
      </View>
    </ScrollView>
  );
}

export default function AdminPromotions() {
  return (
    <PromotionsProvider>
      <Promotions />
    </PromotionsProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    rowGap: 10,
  },
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: PRIMARY_COLOR_DARK,
    padding: 7,
    flexDirection: 'row',
    columnGap: 5,
  },
  addButtonText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  listContent: {
    rowGap: 10,
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  emptyText: {
    fontFamily: BODY_FONT,
  },
});
