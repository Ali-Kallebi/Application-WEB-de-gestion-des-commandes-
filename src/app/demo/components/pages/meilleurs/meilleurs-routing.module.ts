import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MeilleursComponent } from './meilleurs.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MeilleursComponent }
    ])],
    exports: [RouterModule]
})
export class MeilleursRoutingModule { }
