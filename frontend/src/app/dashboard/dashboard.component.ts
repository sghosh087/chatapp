import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { take } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Component({
    selector: 'app-dashboard',
    styleUrls: ['dashboard.component.css'],
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit {
    message: string;

    @ViewChild('chatArea') chatArea: ElementRef;
    @ViewChild('userArea') userArea: ElementRef;

    userList: any = [];
    loggedInUserName: string;
    constructor(private socket: Socket, private userService: UserService) { }

    ngOnInit() {

        this.userService.getLoggedinUsers().subscribe(
            (users: any) => {
                this.userList = users.users;
            }
        )

        this.socket.on('connect', () => {
            this.socket.on('userAdded', (data: any) => {
                if (data) {
                    const index = this.userList.findIndex((user) => {
                        return user.id === data.id;
                    })
                    if (index == -1) {
                        this.userList.push({ id: data.id, userName: data.userName });
                    }
                }
            }
            )

            this.socket.on('roomMessage', (data) => {
                if (data.message) {
                    const msgDiv = document.createElement('div');
                    msgDiv.innerHTML = `<strong>${data.userName}:</strong> ${data.message}`;
                    msgDiv.classList.add('msgDiv');
                    this.chatArea.nativeElement.append(msgDiv);
                }

            })

            this.socket.on('userLeft', (user) => {
                if (user) {
                    const index = this.userList.findIndex((usr) => {
                        return usr.id === user[0].id;
                    })
                    if (index !== -1) {
                        this.userList.splice(index,1);
                    }
                    const msgDiv = document.createElement('div');
                    msgDiv.innerHTML = `<i>${user[0].userName}</i> has left the chat`;
                    this.chatArea.nativeElement.append(msgDiv);
                }
            })

            this.userService.user.pipe(
                take(1)
            ).subscribe(
                user => {
                    if (user) {
                        this.loggedInUserName = user.firstName;
                        this.socket.emit('setUserName', { userName: user.firstName });
                    }

                }
            )


        })


    }

    sendMessage(event: any) {
        if (event.type === 'click' || (event.type === 'keydown' && event.keyCode === 13)) {
            if (this.message) {
                this.socket.emit('message', { userName: this.loggedInUserName, message: this.message });
                this.message = '';
            }
        }

    }

}