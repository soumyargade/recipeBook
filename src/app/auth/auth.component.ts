import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService, AuthResponseData } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';

@Component({
    selector: 'app-auth', 
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {

    inLoginMode = true;
    isLoading = false;
    error: string = null;
    // Will get the first instance of the directive from the template
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

    private closeSubscription: Subscription;

    constructor(
        private authService: AuthService, 
        private router: Router, 
        private componentFactoryResolver: ComponentFactoryResolver) { }

    onSwitchModes() {
        // Reverses the value of the mode
        this.inLoginMode = !this.inLoginMode;
    }

    onSubmit(form: NgForm) {
        // console.log(form.value);
        if (!form.valid) {
            return;
        } 
        const email = form.value.email;
        const password = form.value.password;

        let authObservable: Observable<AuthResponseData>;

        this.isLoading = true;

        if (this.inLoginMode) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signup(email, password);
        }

        authObservable.subscribe(
            responseData => {
                console.log(responseData);
                this.isLoading = false;
                // Navigating to recipes tab after successful authentication
                this.router.navigate(['/recipes']);
            }, 
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );
        form.reset();
    }

    onHandleError() {
        // Will close the alert
        this.error = null;
    }

    ngOnDestroy() {
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }

    private showErrorAlert(message: string) {
        // Incorrect way to create component
            // const alertCmp = new AlertComponent();
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        // Clearing anything that was rendered in the past
        hostViewContainerRef.clear();
        // Creating a new component in that place
        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

        componentRef.instance.message = message;
        this.closeSubscription = componentRef.instance.close.subscribe(
            () => {
                this.closeSubscription.unsubscribe();
                hostViewContainerRef.clear();
            }
        );
    }
}