import { UserRoleState } from "./user-role-state";

export class UserRole {

    constructor(

        public id: number | null = null, 

        public code: string | null = null,

        public name: string | null = null, 

        public state: UserRoleState | null = null,

        public permissions: any[] | null = null,

    ) {};

}
