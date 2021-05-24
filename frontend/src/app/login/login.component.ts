import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService, Login } from '../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {

    @ViewChild('loginFrm') loginFrm: NgForm;
    loginError: string;
    constructor(private userService: UserService, private router: Router) {
    }

    onLogin() {
        const loginData: Login = {
            email: this.loginFrm.value.email,
            password: this.loginFrm.value.password
        };
        this.userService.login(loginData).subscribe(
            data => {
                this.router.navigate(['dashboard']);
                return;
            },
            err => {
                this.loginError = err.error.message;
            }
        )
    }

}