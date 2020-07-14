import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

// Defined in the Firebase Auth REST API documentation
export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    // Used only for the login request
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {

    // Emit whenever we login or logout
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) { }
    
    // Documentation on Firebase Auth REST API signup page
    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBHT7q_iICL-5RV2y-FE-IchvlMXkhlvaE', 
            {
                email: email, 
                password: password, 
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(responseData => {
            this.handleAuth(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
        }));
    }

    // Documentation on Firebase Auth REST API signup page
    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBHT7q_iICL-5RV2y-FE-IchvlMXkhlvaE', 
            {
                email: email, 
                password: password, 
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(responseData => {
            this.handleAuth(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
        }));
    }

    autoLogin() {
        // Retrieve data from local storage
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            // Can't log the user in
            return;
        }
        const loadedUser = new User(
            userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        if (loadedUser.token) {
            // If we have a user and the token is valid
            this.user.next(loadedUser);
            // Future date - current date = amount of time until token expires
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        // Setting the user back to null
        this.user.next(null);
        // Redirecting to authentication
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        // Clearing the timer upon manual logout
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    // Automatically logs user out once token has expired
    autoLogout(expirationDuration: number) {
        // console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            // Called after the expiration duration
            this.logout();
        }, expirationDuration);
    }

    private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
        // Current timestamp in milliseconds to which we add the expiration time, converting from ms
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        // Emit this user as the user who is currently logged in
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        // Writing an item to local storage
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        // In the event the error format doesn't match the expected format
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct!';
                break;
        }
        return throwError(errorMessage);
    }
}