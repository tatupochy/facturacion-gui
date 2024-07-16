import { Customer } from "./customer";
import { Invoice } from "./invoice";
import { Product } from "./product";

export class Sale {

    constructor(

        public id: number | null = null,

        public cliente: Customer | null = null,

        public cantidad: number = 0,

        public producto: Product | null = null,

        public factura: Invoice | null = null,

    ) {};

}
