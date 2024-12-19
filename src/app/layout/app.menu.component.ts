import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { UserService } from '../demo/service/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.css']
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    role : any;

    constructor(
        public layoutService: LayoutService,
        private userService: UserService, // Injectez le service UserService
        private router: Router
      ) { }
    ngOnInit() {

        this.role = localStorage.getItem('role')
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Tableau de bord', icon: 'pi pi-fw pi-home', command: () => this.navigateToDashboard(),
                        visible : this.role == 'RH'
                     },
                    
                    
                    
                   
                   
                    
                ]
            },
            
            {
                items:[{ label: 'Commandes', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'],
                    visible : this.role == 'RH'
                 },]
            },
            {
                items:[{
                    label: 'Mission',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/pages/mission'],
                    visible: this.role !== 'RH' 
                },]
            },
            {
                items:[{
                    label: 'Utilisateur',
                    icon: 'pi pi-fw pi-user',
                    routerLink: ['/pages/utilisateurs'],
                    
                    
                },]
            },
            {
                items:[{
                    label: 'Produits',
                    icon: 'pi pi-fw pi-shopping-cart',
                    routerLink: ['/pages/produit']
                },]
            },
            {
                items:[{
                    label: 'Meilleur Ouvrier',
                    icon: "pi pi-fw pi-user",
                    routerLink: ['/pages/meilleurs']
                },]
            },
           
            {
                items:[{
                    label: 'Calendrier',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: ['/uikit/formlayout']
                },]
            },
            
           
            {
                items:[ {
                    label: 'Enregistrer',
                    icon: 'pi pi-fw pi-user-plus', 
                    routerLink: ['/auth/register'] ,
                    visible : this.role == 'RH'
                },]
            },
            {
                items: [
                    
                    
                    { label: 'Graphiques', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                ]
            },
          
           
            
            
               
        ];
    }
    logout(): void {
        this.userService.logout(); // Appeler la méthode logout() du service UserService
      }
      navigateToDashboard(): void {
        if (this.userService.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
            
        } else {
            // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
            this.router.navigate(['/login']);
        }
    }
    
}
