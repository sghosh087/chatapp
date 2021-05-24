import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { UserService } from "../services/user.service";

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    userSub: Subscription;
    isLoggedIn: boolean = false;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userSub = this.userService.user.subscribe(
            user => {
                this.isLoggedIn = !!user;
            }
        )
    }

    logout() {
        this.userService.logout();
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
}