import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from "rxjs";
import { first, tap } from "rxjs/operators";
import { User } from "../models/user.model";
import { Router } from '@angular/router';

export interface responseData {
    userData: {
        firstName: string,
        lastName: string,
        email: string,
        token: string
        id: string,
        expiresIn: string
    }
}

export interface registrationData {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface Login {
    email: string,
    password: string
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    serverUrl = 'http://localhost:5000/api';

    user = new BehaviorSubject<User>(null);

    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    register(registrationData: registrationData) {
        return this.http.post<any>(`${this.serverUrl}/user/register`, {...registrationData});
    }

    login(loginData: Login ) {
        return this.http.post<responseData>(`${this.serverUrl}/user/login`, { ...loginData}).pipe(
            tap(
                (resData) => {
                    console.log('resData', resData.userData.token)
                    const expirationDate = new Date(new Date().getTime() + (+resData.userData.expiresIn * 1000));
                    const user = new User(resData.userData.firstName, resData.userData.lastName, resData.userData.email, resData.userData.id, resData.userData.token, expirationDate);
                    this.user.next(user);
                    this.autoLogout(+resData.userData.expiresIn * 1000);
                    localStorage.setItem('userData',JSON.stringify(user));
                }
            )
        );
    }

    getLoggedinUsers() {
        return this.http.get<string[]>(`${this.serverUrl}/loggedin-users`);
    }

    autoLogin() {
        let userData: {
            firstName: string,
            lastName: string,
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData) {
            return;
        }
        const loggedInUser = new User(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        )
        if(loggedInUser.token) {
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
            this.user.next(loggedInUser);
        }

    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    logout() {
        this.user.next(null);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.router.navigate(['/login']);
    }
}