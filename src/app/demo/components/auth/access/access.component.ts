import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { UserService } from 'src/app/demo/service/user.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
})
export class AccessComponent {
  email: string = ''; 
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService, private router: Router) { } // Inject Router

  requestPasswordReset(): void {
    console.log('Email input:', this.email); // Debugging log

    if (!this.email) {
      this.errorMessage = 'Veuillez entrer votre adresse email.';
      this.successMessage = '';
      return;
    }

    this.userService.requestPasswordReset(this.email).subscribe(
      response => {
        console.log('Response:', response); // Debugging log
        this.successMessage = 'Un lien de réinitialisation du mot de passe a été envoyé à votre adresse email.';
        this.errorMessage = '';

        // Redirection vers /uikit/floatlabel après un court délai
        setTimeout(() => {
          this.router.navigate(['/auth/message']);
        }, 2000); // Ajustez le délai selon vos besoins
      },
      error => {
        console.error('Error:', error); // Debugging log
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        this.successMessage = '';
      }
    );
  }
}
