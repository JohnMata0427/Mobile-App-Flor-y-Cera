import { Alert } from 'react-native';

interface ConfirmationAlertOptions {
  title?: string;
  message: string;
  onConfirm: () => void;
  confirmButtonText?: string;
}

export const showConfirmationAlert = ({
  title = 'Mensaje del sistema',
  message,
  onConfirm,
  confirmButtonText = 'Aceptar',
}: ConfirmationAlertOptions) => {
  Alert.alert(title, message, [
    {
      text: 'Cancelar',
      style: 'cancel',
    },
    {
      text: confirmButtonText,
      onPress: onConfirm,
    },
  ]);
};
