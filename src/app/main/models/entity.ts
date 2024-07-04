import { EntityType } from "./entity-type";
import { State } from "./state";

export class Entity {

    constructor(

        public id: number | null = null,

        public name: string | null = null,

        public fantasyName: string | null = null,

        public ruc: string | null = null,

        public code: string | null = null,

        public state: State | null = null,

        public type: EntityType | null = null,

        public documentsRootPath: string | null = null,

    ) {};

}
