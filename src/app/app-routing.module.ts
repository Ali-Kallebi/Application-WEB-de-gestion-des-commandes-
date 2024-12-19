import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './demo/components/auth/login/login.component';
import { AppLayoutComponent } from './layout/app.layout.component';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Route pour la page de connexion
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige vers la page de connexion par défaut
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard], // Protégez cette route avec AuthGuard
    children: [
      
      { path: 'dashboard', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule)},
      { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UikitModule) },
      { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
      { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
      { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
      { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
    ]
  },
  { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
  { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
 
  { path: '**', redirectTo: 'dashboard' } // Redirection pour toutes les autres routes non définies
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }