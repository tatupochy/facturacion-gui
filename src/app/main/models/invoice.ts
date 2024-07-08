import { Customer } from "./customer";
import { InvoiceItem } from "./invoice-item";

export class Invoice {

    constructor(

        public id: number | null = null,

        public numero: string | null = null,

        public numeracion: string | null = null,

        public fecha_emision : Date | null = null,

        public cliente: Customer | null = null,
        
        public sub_total: number | null = null,

        public total: number | null = null,

        public establecimiento: string | null = null,

        public punto_expedicion: string | null = null,

        public fecha_vencimiento: Date | null = null,

        public timbrado: string | null = null,

        public condicion_venta: string | null = null,
                    
        public total_iva_5: number | null = null,

        public sub_total_iva_5: number | null = null,

        public total_iva_10: number | null = null,

        public sub_total_iva_10: number | null = null,

        public total_iva: number | null = null,

        public sub_total_iva: number | null = null,

        public items: InvoiceItem[] | null = null

    ) {};

}
