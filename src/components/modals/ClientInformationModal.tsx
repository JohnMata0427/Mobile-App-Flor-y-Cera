import { GRAY_COLOR_DARK, PRIMARY_COLOR, PRIMARY_COLOR_DARK } from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import type { Client } from '@/interfaces/Client';
import { toLocaleDate } from '@/utils/toLocaleDate';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface ClientInformationModalProps {
  isVisible: boolean;
  onClose: () => void;
  client: Client;
}

export const ClientInformationModal = memo(
  ({ isVisible, onClose, client }: ClientInformationModalProps) => {
    const {
      nombre,
      apellido,
      email,
      genero,
      imagen,
      estado,
      cedula,
      direccion,
      telefono,
      fecha_nacimiento,
      createdAt,
      updatedAt,
    } = client;
    const defaultImage =
      genero === 'Masculino'
        ? require('@/assets/male-user-default.jpg')
        : require('@/assets/female-user-default.jpg');

    return (
      <Modal
        visible={isVisible}
        backdropColor={'rgba(0, 0, 0, 0.1)'}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <Image
            source={imagen ? { uri: imagen } : defaultImage}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.informationCard}>
            <Text style={styles.titleText}>Información del Cliente</Text>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="account" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Nombre: </Text>
                {nombre} {apellido}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="email" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Correo electrónico:</Text> {email}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="gender-male-female" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Género:</Text> {genero}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="lock-open" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Estado:</Text> {estado}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="identifier" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Cédula:</Text> {cedula ?? 'No registrada'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="map-marker" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Dirección:</Text> {direccion ?? 'No registrada'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="phone" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Teléfono:</Text> {telefono ?? 'No registrado'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="calendar" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Fecha de nacimiento:</Text>{' '}
                {toLocaleDate(fecha_nacimiento)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="calendar-check" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Fecha de creación:</Text>{' '}
                {toLocaleDate(createdAt)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons color={GRAY_COLOR_DARK} name="update" size={16} />
              <Text style={styles.detailText}>
                <Text style={styles.detailTextBold}>Última actualización:</Text>{' '}
                {toLocaleDate(updatedAt)}
              </Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalContainer: {
    margin: 'auto',
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 20,
    overflow: 'visible',
  },
  image: {
    width: 150,
    height: 150,
    aspectRatio: 1,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    alignSelf: 'center',
    position: 'absolute',
    top: -75,
    elevation: 10,
  },
  informationCard: {
    marginTop: 80,
    rowGap: 4,
  },
  titleText: {
    fontFamily: BOLD_BODY_FONT,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  detailText: {
    fontFamily: BODY_FONT,
  },
  detailTextBold: {
    fontFamily: BOLD_BODY_FONT,
    color: PRIMARY_COLOR_DARK,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR_DARK,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontFamily: BOLD_BODY_FONT,
  },
});
