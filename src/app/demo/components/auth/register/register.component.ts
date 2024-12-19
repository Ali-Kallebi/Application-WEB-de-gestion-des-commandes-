import { Component } from '@angular/core';
import { UserService } from 'src/app/demo/service/user.service';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData = {
    nom: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  msgs: Message[] = [];
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;
  formSubmitted: boolean = false; 
  errorMsg: string = '';

  constructor(private userService: UserService,
    private messageService: MessageService
  ) {}

  onSubmit() {
    this.formSubmitted = true; // Set formSubmitted to true on submission

    if (this.formData.password !== this.formData.confirmPassword) {
      console.error('Password and Confirm Password must match.');
      return;
    }

    // Validate password format (at least 5 characters, including uppercase, lowercase, and digits)
    if (!this.isValidPassword(this.formData.password)) {
      console.error('Invalid password format. Password must contain at least 5 characters, including uppercase, lowercase, and digits.');
      return;
    }

    // Validate email format (must be a valid email address)
    if (!this.isValidEmail(this.formData.email)) {
      console.error('Invalid email format. Please enter a valid email address (e.g., example@gmail.com).');
      return;
    }

    // Register user
    this.userService.registerUser({
      nom: this.formData.nom,
      email: this.formData.email,
      password: this.formData.password,
      prenom: null,
      tel: null,
      specialite: null,
      localisation: null
    }).subscribe(
      (response) => {
        console.log('User registered successfully:', response);
        this.showSuccessViaMessages();
        this.resetForm();
      },
      (error) => {
        console.error('Error registering user:', error);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error });
        this.errorMsg = error;
      }
    );
  }

  // Validate password format (at least 5 characters, including uppercase, lowercase, and digits)
  isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;
    return passwordRegex.test(password);
  }

  // Validate email format (must be a valid email address)
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Ajouter une validation supplémentaire pour exiger '.com' à la fin de l'adresse email
    const requiredSuffix = /\.com$/i; // i pour ignorer la casse (com ou COM)
    
    return emailRegex.test(email) && requiredSuffix.test(email);
  }
  

  resetForm(): void {
    this.formData = {
      nom: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
    this.formSubmitted = false; // Reset formSubmitted after form is reset
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
  togglePasswordConfirmVisibility(): void {
    this.hidePasswordConfirm = !this.hidePasswordConfirm;
  }

  showSuccessViaMessages() {
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success Registre', detail: 'Enregistrement de compte validé' });
  }
}
