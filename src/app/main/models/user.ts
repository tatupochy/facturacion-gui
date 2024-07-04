import { UserRole } from "./user-role";
import { UserState } from "./user-state";

export class User {

    constructor(

        public id: number | null = null,

        public name: string | null = null,

        public password: string | null = null,

        public email: string | null = null,

        public roles: UserRole[] | null = null,

        public roleNames: string | null = null,

        public state: UserState | null = null
        
    ) {}

}
