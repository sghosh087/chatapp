import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
    declarations: [
        RegistrationComponent,
        LoginComponent,
        DashboardComponent
    ],
    imports: [
        HttpClientModule,
        UserRoutingModule,
        CommonModule,
        FormsModule
    ],
})
export class UserModule {

}