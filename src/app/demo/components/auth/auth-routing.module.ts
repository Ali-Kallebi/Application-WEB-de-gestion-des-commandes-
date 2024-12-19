import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      
      { path: 'access', loadChildren: () => import('./access/access.module').then(m => m.AccessModule) },
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
      { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule) },
      { path: 'reset-password', loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule) },
      { path: 'message', loadChildren: () => import('./message/message.module').then(m => m.MessageModule) }
      
    ])
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
