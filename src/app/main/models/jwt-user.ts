import { Role } from "./role";

export class JwtUser {

    constructor(
        public id: number | null = null,

        public name: string | null = null,
        
        public password: string | null = null,
        
        public accessToken: string,
        
        public refreshToken: string,
        
        public type: string = 'Bearer',
        
        public roles: string[] = [],
        
        public fullRoles: Role[] = []) {
    };

}

