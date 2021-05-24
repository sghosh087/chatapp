import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


import { UserService, registrationData } from '../services/user.service';

@Component({
    selector: 'app-registration',
    templateUrl: 'registration.component.html'
})

export class RegistrationComponent {

    @ViewChild('regFrm') regFrm: NgForm;

    errorMessage: string;
    registrationErrors: any = [];

    constructor(private userService: UserService, private router: Router) { }

    onSubmit() {
        const userData: registrationData = {
            firstName: this.regFrm.value.firstName,
            lastName: this.regFrm.value.lastName,
            email: this.regFrm.value.email,
            password: this.regFrm.value.password
        }
        this.userService.register(userData).subscribe(
            data => {
                this.router.navigate(['login']);
            },
            err => {
                this.errorMessage = err.error.message;
                this.registrationErrors = err.error.errors;
            }
        )
    }
}