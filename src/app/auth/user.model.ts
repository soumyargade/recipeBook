export class User {
    
    constructor(
        public email: string, 
        public id: string, 
        private _token: string, 
        private _tokenExpirationDate: Date) { }

    get token() {
        // If the token expiration date is smaller than the current date that means that
            // it was in the past, or in other words, that it expired
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}