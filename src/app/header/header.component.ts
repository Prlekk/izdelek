import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

import { faHouse, faPlus, faRightFromBracket, faUser, faUserPlus, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']   
})

export class HeaderComponent implements OnInit, OnDestroy {
    faHouse = faHouse;
    faPlus = faPlus;
    faLogout = faRightFromBracket;
    faUser = faUser;
    faUserPlus = faUserPlus;
    faRightToBracket = faRightToBracket;
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }
}