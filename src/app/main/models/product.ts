

export class Product {

    constructor(

        public id: number | null = null,

        public nombre: string | null = null,

        public stock: number | null = null,

        public costo: number | null = null,

        public descripcion: string | null = null,

        public precio: number | null = null,

        public iva: string | null = null,

        public activo: boolean | true = true

       

    ) {};

}
