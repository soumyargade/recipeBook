import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Defined in the Firebase Auth REST API documentation
interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private http: HttpClient) { }
    
    // Documentation on Firebase Auth REST API signup page
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBHT7q_iICL-5RV2y-FE-IchvlMXkhlvaE', 
            {
                email: email, 
                password: password, 
                returnSecureToken: true
            }
        );
    }

    signin() {
        // ...
    }
}