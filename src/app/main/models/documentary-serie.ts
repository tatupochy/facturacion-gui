import { Descriptor } from "./descriptor";
import { Entity } from "./entity";

export class DocumentarySerie {

    constructor(

        public id: number | null = null,

        public code: string | null = null,

        public name: string | null = null,

        public startDate: Date | null = null,

        public endDate: Date | null = null,

        public entity: Entity | null = null,

        public descriptor: Descriptor | null = null

    ) {};

}
