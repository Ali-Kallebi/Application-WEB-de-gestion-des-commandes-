import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'crud', loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
      { path: 'utilisateurs', loadChildren: () => import('./utilisateur/utilisateur.module').then(m => m.UtilisateurModule) },
      { path: 'timeline', loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
      { path: 'mission', loadChildren: () => import('./mission/mission.module').then(m => m.MissionModule) },
      {path: 'produit', loadChildren: () => import('./produit/produit.module').then(m => m.ProduitModule) },
      {path: 'meilleurs', loadChildren: () => import('./meilleurs/meilleurs.module').then(m => m.MeilleursModule) }
    ])
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
