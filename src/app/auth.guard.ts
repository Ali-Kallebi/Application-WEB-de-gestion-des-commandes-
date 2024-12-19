// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('authToken')) {
      // Si le jeton d'authentification existe, l'utilisateur est connecté
      return true;
    } else {
      // Sinon, rediriger l'utilisateur vers la page de connexion
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
