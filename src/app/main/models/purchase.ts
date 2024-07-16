import { Invoice } from "./invoice";
import { Product } from "./product";
import { Provider } from "./provider";

export class Purchase {

    constructor(

        public id: number | null = null,

        public proveedor: Provider | null = null,

        public cantidad: number = 0,

        public producto: Product | null = null,

        public factura: Invoice | null = null,

    ) {};

}
