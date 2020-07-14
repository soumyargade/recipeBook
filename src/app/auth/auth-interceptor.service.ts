import { Injectable } from '@angular/core';
import{ HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    // Using an interceptor to add a token to the request
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        // Automatically unsubscribes after 1 value has been taken
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            if (!user) {
                // Don't try to modify the request
                return next.handle(request);
            }
            // Only try to modify the request if there is a token
            const modifiedRequest = request.clone({params: new HttpParams().set('auth', user.token)});
            return next.handle(modifiedRequest);
        }));
    }
}