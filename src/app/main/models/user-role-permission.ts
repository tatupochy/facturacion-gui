import { Resource } from "./resource";
import { UserRole } from "./user-role";

export class UserRolePermission {

    constructor(

        public id: number | null = null, 

        public role: UserRole | null = null,

        public resource: Resource | null = null,

        public isEnabled: boolean | null = null,

        public isVisible: boolean | null = null,

    ) {};

}
