import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { UserRoutingModule } from './user-routing.module';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', redirectTo: ''}
]
@NgModule({
    declarations: [],
    imports: [
        UserRoutingModule,
        RouterModule.forRoot(routes)
    ],
    exports: []
})
export class AppRoutingModule { }