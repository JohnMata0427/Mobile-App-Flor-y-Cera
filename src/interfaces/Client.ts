export interface Client {
  _id: string;
  nombre: string;
  apellido: string;
  genero: 'Masculino' | 'Femenino';
  email: string;
  estado: 'activo' | 'inactivo';
  imagen?: string;
  telefono?: string;
  fecha_nacimiento?: Date;
  direccion?: string;
  cedula?: string;
  ciudad?: string;
  createdAt?: string;
  updatedAt?: string;
}
