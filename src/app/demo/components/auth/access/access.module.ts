import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AccessRoutingModule } from './access-routing.module';
import { AccessComponent } from './access.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        AccessRoutingModule,
        ButtonModule,
        FormsModule,
       
        
    ],
    declarations: [AccessComponent]
})
export class AccessModule { }
