import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/demo/service/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loginErrorMessage: string = '';
  loginSuccessMessage: string = '';
  usernom: string | null = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Retrieve the username from query parameters
    this.route.queryParams.subscribe(params => {
      this.usernom = params['usernom'];
    });
  }

  async signIn(): Promise<void> {
    if (!this.email || !this.password) {
      this.loginErrorMessage = 'Veuillez saisir votre adresse e-mail et votre mot de passe.';
      this.loginSuccessMessage = '';
      return;
    }

    try {
      const response = await this.userService.loginUser(this.email, this.password).toPromise();
      console.log('User logged in successfully:', response);
      localStorage.setItem('idUser', response.id);
      localStorage.setItem('userEmail', this.email);
      localStorage.setItem('role', response.role);

      // Reset fields and show success message
      this.email = '';
      this.password = '';
      this.loginErrorMessage = '';
      this.loginSuccessMessage = 'Bienvenue ! Connexion réussie.';

      // Redirect to the dashboard page after successful login
      if (response.role === 'RH') {
        this.router.navigate(['/dashboard']); // Redirect to the dashboard for RH role
      } else {
        this.router.navigate(['/pages/mission']); // Redirect to your main page for other roles
      }
    } catch (error) {
      console.error('Error logging in user:', error);
      this.loginErrorMessage = 'Email ou mot de passe incorrect. Veuillez réessayer.';
      this.loginSuccessMessage = '';
    }
  }

  redirectToForgotPassword(): void {
    // Redirect to the AccessComponent
    this.router.navigate(['/auth/access']);
  }
}
