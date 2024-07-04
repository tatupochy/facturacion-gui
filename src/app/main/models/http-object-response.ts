import { HttpError } from "./http.error";

export class HttpObjectResponse<T> {

    constructor(
        
        public responseObject: T, 
        
        public error : HttpError
        
    ) {}

}
