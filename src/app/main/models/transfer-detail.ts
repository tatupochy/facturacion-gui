import { Transfer } from "./transfer";

export class TransferDetail {

    constructor(

        public id: number | null = null,

        public transfer: Transfer | null = null,

        public identifier: string | null = null,
        
        public updateUser: string | null = null,
        
        public updateDate: Date | null = null,
        
        public updateDateStr: string | null = null,

    ) {};

}
