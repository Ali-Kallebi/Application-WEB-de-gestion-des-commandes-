import { Component, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { UserService } from 'src/app/demo/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../demo/api/user';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [`
    .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-right: 1rem;
        color: var(--text-color);
    }
    .user-menu {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        padding: 10px;
        border-radius: 4px;
        z-index: 1000;
    }
    .user-menu-active {
        display: block;
    }
    .wrapper {
        width: 300px;
        padding: 20px;
    }
    .wrapper header {
        font-size: 1.5em;
        margin-bottom: 10px;
        text-align: center;
    }
    .field {
        margin-bottom: 15px;
    }
    .input-area {
        position: relative;
    }
    .input-area input {
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
    }
    .icon, .error-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
    }
    .error-txt {
        color: red;
        font-size: 0.8em;
    }
    .pass-txt, .sign-txt {
        text-align: center;
        margin-top: 10px;
    }
    .pass-txt a, .sign-txt a {
        color: blue;
        text-decoration: underline;
    }
    .button-container {
        display: flex;
        justify-content: center;
        gap: 10px; /* Adjust the gap between buttons as needed */
        margin-top: 10px; /* Add some margin-top to separate from the above content */
    }
    .custom-button {
        min-width: 120px; /* Set a minimum width for the buttons */
        padding: 10px 20px; /* Add padding for better appearance */
    }
      
    `]
})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    userEmail: string | null = '';
    userMenuVisible: boolean = false;
    token: string = '';
    email: string = '';
    usernom: string | null = '';
    userprenom: string | null = '';
    avatarUrl: string | null = ''; // Ajoutez cette ligne

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild('userMenu') userMenu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    
    ngOnInit(): void {
        this.usernom = null;
        this.userprenom = null;

        this.userEmail = localStorage.getItem('userEmail');
        const userId = localStorage.getItem('idUser');
        if (userId) {
            this.userService.getUserById(Number(userId)).subscribe((user: User) => {
                if (user.nom !== undefined) {
                    this.usernom = user.nom;
                }
                if (user.prenom !== undefined) {
                    this.userprenom = user.prenom;
                }
                if (user.avatar) {
                    this.avatarUrl = `http://127.0.0.1:8000/avatars/${user.avatar}`; // Assurez-vous que cela correspond à l'URL correcte
                }
            });
        }
    }

    toggleUserMenu(): void {
        this.userMenuVisible = !this.userMenuVisible;
    }

    redirectToForgotPassword(): void {
        this.router.navigate(['/uikit/panel']);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!this.userMenu.nativeElement.contains(target) && !this.menuButton.nativeElement.contains(target) && !this.topbarMenuButton.nativeElement.contains(target)) {
            this.userMenuVisible = false;
        }
    }

    onTopbarClick(event: MouseEvent): void {
        event.stopPropagation();
    }
    redirectTologin(): void {
        // Rediriger vers le composant AccessComponent
        this.router.navigate(['/auth/login']);
    }
    redirectTocalender(): void {
        // Rediriger vers le composant AccessComponent
        this.router.navigate(['/uikit/formlayout']);
    }
    logout(): void {
        this.userService.logout(); // Appeler la méthode logout() du service UserService
      }
}
