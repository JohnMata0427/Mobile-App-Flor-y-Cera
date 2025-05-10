export interface Product {
	__v:          number;
	_id:          string;
	aroma:        string;
	beneficios:   string[];
	createdAt:    Date;
	descripcion:  string;
	descuento:    number;
	id_categoria: IDCategoria;
	imagen:       string;
	imagen_id:    string;
	ingredientes: string[];
	nombre:       string;
	precio:       number;
	stock:        number;
	tipo:         string;
	updatedAt:    Date;
}

export interface IDCategoria {
	__v:         number;
	_id:         string;
	createdAt:   Date;
	descripcion: string;
	imagen:      string;
	imagen_id:   string;
	nombre:      string;
	updatedAt:   Date;
}
