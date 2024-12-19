import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        ResetPasswordRoutingModule
       
        
    ],
    declarations: [ResetPasswordComponent ]
})
export class ResetPasswordModule { }
