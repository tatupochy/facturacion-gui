import { ResourceType } from "./resource-type";

export class Resource {

    constructor(

        public id: number | null = null,

        public code: string | null = null,

        public name: string | null = null,

        public description: string | null = null,

        public level: number | null = null,

        public canEdit: boolean | null = null,

        public isEditing: boolean | null = null,

        public isLeaf: boolean | null = null,

        public resourceType: ResourceType | null = null,

        public resourceTypeCode: string | null = null,

        public parent: Resource | null = null,

    ) {}

}
