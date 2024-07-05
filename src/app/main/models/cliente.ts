

export class Client {

    constructor(

        public id: number | null = null,

        public nombre: string | null = null,

        public direccion: string | null = null,

        public telefono: string | null = null,

        public email: string | null = null,

        public ruc: string | null = null,

        public pais: string | null = null,

        public activo: boolean | true = true,

    ) {};

}
