export interface Client {
  _id: string;
  nombre: string;
  apellido: string;
  genero: 'Masculino' | 'Femenino';
  email: `${string}@${string}.${string}`;
  estado: 'activo' | 'inactivo';
  imagen?: string;
  telefono?: string;
  fecha_nacimiento?: `${number}-${number}-${number}`;
  direccion?: string;
  cedula?: string;
  ciudad?: string;
  createdAt?: string;
  updatedAt?: string;
  notificationPushToken?: string | null;
}

export interface ClientFilter {
  key: keyof Client;
  value: 'activo' | 'inactivo' | 'masculino' | 'femenino' | '';
}
