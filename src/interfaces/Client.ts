export interface Client {
  __v: number;
  _id: string;
  apellido: string;
  cedula?: string;
  confirmEmail: boolean;
  createdAt: Date;
  direccion?: string;
  email: string;
  fecha_nacimiento?: Date;
  genero: string;
  imagen?: string;
  imagen_id?: string;
  nombre: string;
  telefono?: string;
  updatedAt: Date;
  estado: string;
}
