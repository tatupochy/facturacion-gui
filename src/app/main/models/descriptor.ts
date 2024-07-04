import { DataType } from "./data-type";

export class Descriptor {

    constructor(

        public id: number | null = null,

        public code: string | null = null,

        public name: string | null = null,

        public minLen: number | null = null,

        public maxLen: number | null = null,

        public dataType: DataType | null = null,

    ) {};

}