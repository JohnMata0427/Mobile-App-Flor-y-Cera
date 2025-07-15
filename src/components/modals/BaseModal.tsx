import {
  PRIMARY_COLOR,
  PRIMARY_COLOR_DARK,
  SECONDARY_COLOR,
  SECONDARY_COLOR_DARK,
} from '@/constants/Colors';
import { BODY_FONT, BOLD_BODY_FONT } from '@/constants/Fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { memo, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
} from 'react-native';

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
    maxHeight = '90%',
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
        transparent
      >
        <BlurView
          intensity={10}
          style={StyleSheet.absoluteFill}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
        />
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
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
                <MaterialCommunityIcons name="close-thick" size={14} color="white" />
              </Pressable>
              {!hideActionButton && actionButtonLabel && onActionButtonPress && (
                <Pressable
                  style={[
                    styles.submitButton,
                    isActionButtonDisabled && styles.submitButtonDisabled,
                  ]}
                  onPress={onActionButtonPress}
                  disabled={isActionButtonDisabled}
                >
                  {isActionButtonLoading ? (
                    <ActivityIndicator size={14} color="white" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>{actionButtonLabel}</Text>
                      <MaterialCommunityIcons name="content-save" size={14} color="white" />
                    </>
                  )}
                </Pressable>
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
    fontFamily: BOLD_BODY_FONT,
    fontSize: 18,
    textAlign: 'center',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    justifyContent: 'center',
  },
  subtitleText: {
    fontFamily: BODY_FONT,
    fontSize: 12,
    textAlign: 'center',
    color: PRIMARY_COLOR,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    columnGap: 5,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 5,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: PRIMARY_COLOR_DARK,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#999',
  },
  submitButtonText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    fontSize: 12,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 5,
    width: '40%',
    backgroundColor: SECONDARY_COLOR,
    borderColor: SECONDARY_COLOR_DARK,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: BOLD_BODY_FONT,
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});
