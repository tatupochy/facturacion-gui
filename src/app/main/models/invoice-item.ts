import { Product } from './product';
import { Invoice } from './invoice';

export class InvoiceItem {

    constructor(

        public id: number | null = null,

        public factura: Invoice | null = null,

        public producto: Product | null = null,

        public cantidad: number | null = null,

        public precio: number | null = null,

        public iva_exenta: number | null = null,

        public iva_5: number | null = null,
        
        public iva_10: number | null = null

    ) {};

}
