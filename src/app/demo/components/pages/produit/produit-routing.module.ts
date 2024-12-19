import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProduitComponent } from './produit.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ProduitComponent }
  ])],
  exports: [RouterModule]
})
export class ProduitRoutingModule { }
