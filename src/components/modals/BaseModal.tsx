import { Button } from '@/components/Button';
import { PRIMARY_COLOR, SECONDARY_COLOR, SECONDARY_COLOR_DARK } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { memo, type ReactNode } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View, type DimensionValue } from 'react-native';

interface BaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxHeight?: DimensionValue;
  actionButtonLabel?: string;
  onActionButtonPress?: () => void;
  isActionButtonLoading?: boolean;
  isActionButtonDisabled?: boolean;
  hideActionButton?: boolean;
}

export const BaseModal = memo(
  ({
    isVisible,
    onClose,
    title,
    subtitle,
    children,
    maxHeight = '80%',
    actionButtonLabel,
    onActionButtonPress,
    isActionButtonLoading,
    isActionButtonDisabled,
    hideActionButton,
  }: BaseModalProps) => {
    if (!isVisible) return null;

    return (
      <Modal
        animationType="slide"
        visible={isVisible}
        onRequestClose={onClose}
        backdropColor={'rgba(0, 0, 0, 0.01)'}
        statusBarTranslucent
        navigationBarTranslucent
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={[styles.modalContainer, { maxHeight }]}
        >
          <View style={styles.formContainer}>
            <Text style={styles.titleText}>{title}</Text>
            {subtitle && (
              <View style={styles.subtitleContainer}>
                <MaterialCommunityIcons name="information" size={14} color={PRIMARY_COLOR} />
                <Text style={styles.subtitleText}>{subtitle}</Text>
              </View>
            )}
            {children}
            <View style={styles.actionRow}>
              <Button
                label="Cancelar"
                onPress={onClose}
                icon="close-thick"
                buttonStyle={styles.cancelButton}
              />
              {!hideActionButton && actionButtonLabel && onActionButtonPress && (
                <Button
                  label={actionButtonLabel}
                  onPress={onActionButtonPress}
                  icon="content-save"
                  disabled={isActionButtonDisabled || isActionButtonLoading}
                  buttonStyle={{ flex: 1 }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  scrollContent: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  modalContainer: {
    margin: 'auto',
    width: '90%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  formContainer: {
    rowGap: 5,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'center',
  },
  subtitleText: {
    fontSize: 12,
    textAlign: 'center',
    color: PRIMARY_COLOR,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    columnGap: 10,
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
    flex: 1,
  },
});
