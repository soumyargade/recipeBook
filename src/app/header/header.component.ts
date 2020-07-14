import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {

    isAuthenticated = false;
    private userSubscription: Subscription;

    constructor(
        private dataStorageService: DataStorageService, 
        private authService: AuthService) { }

    ngOnInit() {
        this.userSubscription = this.authService.user.subscribe(
            user => {
                // If we have a user, we are logged in
                // this.isAuthenticated = !user ? false: true;
                this.isAuthenticated = !!user;
            }
        );
    }

    onSaveData() {
        this.dataStorageService.saveRecipes();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
    
    // @Output() featureSelected = new EventEmitter<string>();

    // onSelect(selection: string) {
        // this.featureSelected.emit(selection);
    // }
}