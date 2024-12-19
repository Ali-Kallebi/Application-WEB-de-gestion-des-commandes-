import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError,of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../api/user';  // Importer l'interface User
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
  
    private apiUrl = 'http://127.0.0.1:8000/api/users'; // URL de l'API Laravel
    private currentUserEmail: string | null = null;
  
    constructor(private http: HttpClient,private router: Router) { }
  
    getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.apiUrl)
        .pipe(
          catchError(this.handleError)
        );
    }
  
    getUser(id: number): Observable<User> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.get<User>(url)
        .pipe(
          catchError(this.handleError)
        );
    }
  
   
    async createUser(user: User) {
      try {
          const createdUser = await this.http.post<User>(this.apiUrl, user).toPromise();
          return createdUser;
      } catch (error) {
          console.error('Error creating user:', error);
          throw error;
      }
  }
  

    

  async updateUser(id: any, user: User) {
    try {
        const updatedUser = await this.http.put<User>(`${this.apiUrl}/${id}`, user).toPromise();
        return updatedUser;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

    deleteUser(id:any, user : User) {
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete(this.apiUrl +'/' + id,  ).toPromise();
    
        
    }
  
    private handleError(error: any): Observable<any> {
      console.error('An error occurred', error);
      return throwError(error.message || error);
    }
    registerUser(userData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
        catchError((error) => {
          if (error.status === 409) {
            // Email déjà existant
            return throwError('Ce compte existe déjà.');
          } else {
            // Autres erreurs
            return throwError('Erreur lors de l\'enregistrement du compte.');
          }
        })
      );
    }
    loginUser(email: string, password: string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
        .pipe(
          map(response => {
            // Stockez le jeton d'authentification dans le stockage local
            localStorage.setItem('authToken', response.token);
            return response;
          }),
          catchError(this.handleError)
        );
    }
   logout(): void {
    // Supprimer le jeton d'authentification du stockage local
    localStorage.removeItem('authToken');

    // Naviguer vers la page de connexion
    this.router.navigate(['/auth/login']);
  }
  isLoggedIn(): boolean {
    // Vérifiez si le jeton d'authentification est présent dans le stockage local
    return !!localStorage.getItem('authToken');
  }
  getUserById(userId: number): Observable<User> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<User>(url);
  }
  requestPasswordReset(email: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/password/email', { email })
      .pipe(
        catchError(this.handleError)
      );
  }
  resetPassword(data: { token: string, email: string, password: string, password_confirmation: string }): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/password/reset', data)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateAvatar(data: FormData): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/avatar/update', data)
        .pipe(
            catchError(this.handleError)
        );
}
getUserByEmail(email: string): Observable<User> {
  const url = `${this.apiUrl}/email/${email}`;
  return this.http.get<User>(url)
    .pipe(
      catchError(this.handleError)
    );
}




}

 


  
  
  