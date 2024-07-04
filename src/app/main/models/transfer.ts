import { DocumentarySerie } from "./documentary-serie";
import { Entity } from "./entity";
import { State } from "./state";
import { TransferDetail } from "./transfer-detail";

export class Transfer {

    constructor(

        public id: number | null = null,

        public transferNumber: string | null = null,

        public transferDate: Date | null = null,

        public tranferDateStr: string | null = null,

        public entity: Entity | null = null,

        public state: State | null = null,

        public documentarySerie: DocumentarySerie | null = null,

        public updateUser: string | null = null,

        public updateDate: string | null = null,

        public transferDetails: TransferDetail[] | null = null,

    ) {};

}
