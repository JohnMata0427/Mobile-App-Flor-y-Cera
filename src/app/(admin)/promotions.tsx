import { AdminHeader } from '@/components/AdminHeader';
import { Pagination } from '@/components/Pagination';
import { PromotionModal } from '@/components/PromotionModal';
import {
  GRAY_COLOR_DARK,
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
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { use, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
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
        <FlatList
          data={promotions}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyExtractor={({ _id }) => _id}
          scrollEnabled={false}
          renderItem={({ item }) => {
            const { _id, imagen, nombre, createdAt } = item;

            return (
              <View style={styles.promotionCard}>
                <Image
                  source={{ uri: imagen }}
                  resizeMode="cover"
                  style={styles.promotionImage}
                />
                <View style={styles.promotionInfo}>
                  <Text style={styles.promotionName}>{nombre}</Text>
                  <View style={styles.dateRow}>
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={14}
                      color={GRAY_COLOR_DARK}
                    />
                    <Text style={styles.dateText}>
                      Promoción creada el {toLocaleDate(createdAt)}
                    </Text>
                  </View>

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
                      onPress={() => {
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
                      }}
                    >
                      <MaterialCommunityIcons
                        name="trash-can"
                        size={20}
                        color="white"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.emptyText}>Cargando datos...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="ticket" size={24} />
                <Text style={styles.emptyText}>
                  No se encontraron promociones, agregue una nueva
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          }
        />
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
    paddingHorizontal: 25,
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
  promotionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  promotionImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
  },
  promotionInfo: {
    rowGap: 3,
    paddingTop: 5,
  },
  promotionName: {
    fontFamily: BOLD_BODY_FONT,
    fontSize: 15,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    color: GRAY_COLOR_DARK,
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
    minHeight: 257,
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
