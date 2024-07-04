import { HttpError } from "./http.error";

export class HttpArrayResponse<T> {

    constructor(
        
        public responseObject: T[], 
        
        public error : HttpError) {

    }

}
