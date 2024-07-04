export class HandlerDownloadDocument {

    constructor(

        public documentType: string | '',

        public procedureId: string | '',

        public requesterId: string | '',

        public procedureAssetId: string | '',

        public isCertificate: boolean = false,

        public isImage: boolean = false,

    ) {}

}
