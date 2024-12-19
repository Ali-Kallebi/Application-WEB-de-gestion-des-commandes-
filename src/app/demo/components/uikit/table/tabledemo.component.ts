import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Commande } from 'src/app/demo/api/commande';
import { UserService } from 'src/app/demo/service/user.service';
import { EmailService } from 'src/app/demo/service/email.service';
import { SelectItem } from 'primeng/api';
import { User } from 'src/app/demo/api/user';
import { CommandeService } from 'src/app/demo/service/commande.service';
import { Table } from 'primeng/table';
import { FormLayoutComponent } from '../formlayout/formlayout.component';


@Component({
  templateUrl: './tabledemo.component.html',
  providers: [UserService],
  styleUrls: ['./tabledemo.component.css']
})

export class TableDemoComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild(FormLayoutComponent) formLayoutComponent: FormLayoutComponent | undefined;
  orders$: Observable<Commande[]> | undefined;
  commandeDialog = false;
  selectedOrder: Commande | undefined;
  description:string = '';
  date_affecte: Date = new Date();
  usersDropdownOptions: SelectItem[] = [];
  selectedUser: any ;
  selectedcommande: Commande | null = null;
  statuses: string[] = ['En attente', 'En cours', 'Terminé'];
  selectedFilter: string | null = null;
  commandes: Commande[] = [];
  summaryData: any = {};

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private emailService: EmailService,
    private commandeService: CommandeService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
    this.loadUsersDropdown();
    this.selectedUser = null;
    this.loadSummary();
  }
  showVerified(order: any): void {
    // Implement your logic here.
    console.log(order);
  }
  filterVerified(status: string): void {
    if (this.dt) {
      this.dt.filter(status, 'verified', 'equals');
      
    }
  }
  loadSummary() {
    this.commandeService.getSummary().subscribe(
        (data: any) => {
            this.summaryData = data;
            console.log('Summary Data:', this.summaryData);
        },
        (error) => {
            console.error('Error loading summary:', error);
        }
    );
}
  applyFilter(status: string, filterCallback: Function, columnFilter: any): void {
    if (this.dt) {
      this.dt.filter(status, 'status', 'equals');
      filterCallback(); // Fermer automatiquement la fenêtre de filtre après l'application du filtre
      columnFilter.hide(); // Ajout de cette ligne pour fermer la fenêtre de filtre
    }
  }
  
  resetAndCloseFilter(field: string, filterCallback: Function, columnFilter: any): void {
    if (this.dt) {
      // Réinitialisez le filtre
      this.dt.filter('', field, 'equals');
  
      // Appel du callback pour fermer la fenêtre de filtre
      filterCallback();
  
      // Fermez la fenêtre de filtre associée à la colonne
      if (columnFilter) {
        columnFilter.hide();
      }
    }
  }
  
  
  
    
    

  updateOrderStatus(order: Commande | undefined): void {
    if (!order) {
      console.error('La commande à mettre à jour est undefined.');
      return;
    }
  
    const url = `http://127.0.0.1:8000/api/commandes/${order.id}/update-status`;
    this.http.put<any>(url, { status: order.status }).subscribe(
      (response) => {
        console.log('Statut mis à jour avec succès:', response);
        localStorage.setItem('orderStatus', order.status);
        if (this.selectedOrder) {
          this.selectedOrder = { ...this.selectedOrder, status: order.status };
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
      }
    );
  }
  
  
  onStatusChange(order: Commande): void {
    const url = `http://127.0.0.1:8000/api/commandes/${order.id}/update-status`;
    this.http.put<any>(url, { status: order.status }).subscribe(
        (response) => {
            console.log('Statut mis à jour avec succès:', response);
            localStorage.setItem('orderStatus', order.status);
            this.selectedOrder = { ...this.selectedOrder!, status: order.status };
        },
        (error) => {
            console.error('Erreur lors de la mise à jour du statut:', error);
        }
    );
  }

  fetchOrders(): void {
    this.orders$ = this.http.get<Commande[]>('http://127.0.0.1:8000/api/commandes')
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération des commandes :', error);
          return of([]);
        })
      );
  }

  onFilterInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (this.dt) {
      this.dt.filterGlobal(inputValue || '', 'contains');
    }
  }

  loadUsersDropdown(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.usersDropdownOptions = users
          .filter(user => user.specialite && user.specialite!== 'RH')
          .map(user => ({
            label: `${user.nom } ${user.prenom } (${user.specialite })${user.email } `, // Utilisation de l'opérateur ?. pour éviter l'erreur
            value: user
          }));
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs pour le dropdown :', error);
      }
    );
  }

  showOrderDetails(order: Commande): void {
    this.selectedOrder = order;
    this.commandeDialog = true;
  }

  affecterCommande(): void {
    console.log(this.selectedUser?.value); // Utilisation de l'opérateur de navigation sécurisé (?)
    
    if (this.selectedOrder && this.description.trim() !== '' && this.selectedUser) {
      const selectedUserId = this.selectedUser.value?.id; // Utilisation de l'opérateur de navigation sécurisé (?)
      const commandeId = this.selectedOrder.id;
      const description = this.description.trim(); // Récupérer la raison de rejet
      const date_affecte =   this.date_affecte;; // Date de rejet actuelle
      
      if (this.selectedOrder) {
        const emailData = {
          commande_id: this.selectedOrder.id,
          sujet: "Affectation d'une commande",
          corps: '',
          to: this.selectedUser.value?.email, // Utilisation de l'opérateur de navigation sécurisé (?)
          user: {
            nom: this.selectedUser.value?.nom,
            prenom: this.selectedUser.value?.prenom,
          },
          description: description, // Ajout de la description
          date_affecte: date_affecte // Ajout de la date de rejet
        };
  
        this.emailService.sendEmail(emailData).toPromise()
          .then(() => {
            // Mise à jour du statut localement
            if (this.selectedOrder) {
              this.selectedOrder.status = 'En cours'; // Update status locally
              this.updateOrderStatus(this.selectedOrder);
            }
            // Mise à jour de userId dans la commande sélectionnée
            if (this.selectedOrder && selectedUserId) {
              this.selectedOrder.userId = selectedUserId;
            }
  
            // Appel de la méthode de service pour affecter la commande
            if (this.selectedOrder && selectedUserId) {
              this.commandeService.affecterCommande(this.selectedOrder.id, selectedUserId)
                .subscribe(() => {
                  console.log('Commande affectée avec succès à la mission.');
  
                  // Rafraîchir la liste des commandes après l'affectation
                  this.fetchOrders();
  
                  // Réinitialiser les valeurs après une affectation réussie
                  this.cancelAffectation();
                }, (error) => {
                  console.error('Erreur lors de l\'affectation de la commande à la mission :', error);
                });
  
              this.commandeService.affecteCommande(commandeId, description, date_affecte).subscribe(
                () => {
                  console.log('Raison de rejet et date enregistrées avec succès.');
                },
                (error) => {
                  console.error('Erreur lors de l\'enregistrement de la raison de rejet et de la date :', error);
                }
              );
              const eventData = {
                title: `Affecte commande de ${this.selectedUser.value?.nom}`,
                start: this.date_affecte.toISOString()
              };

              this.http.post('http://127.0.0.1:8000/api/add-event', eventData).subscribe(
                (response) => {
                  console.log('Événement ajouté au calendrier avec succès:', response);
                },
                (error) => {
                  console.error('Erreur lors de l\'ajout de l\'événement au calendrier:', error);
                }
              );
            }
          })
          .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
          });
      }
    } else {
      console.error('Sélectionnez une commande, une description et un utilisateur avant d\'affecter.');
      this.cancelAffectation();
    }
  }
  

  
  saveCommandeToMission(commande: Commande, userId: number): void {
    this.commandeService.affecterCommande(commande.id, userId).subscribe(
      () => {
        console.log('Commande affectée avec succès à la mission.');
        // Rafraîchir la liste des commandes après l'affectation
        this.fetchOrders();
      },
      (error) => {
        console.error('Erreur lors de l\'affectation de la commande à la mission :', error);
      }
    );
  }
  




  cancelAffectation(): void {
    this.commandeDialog = false;
    this.selectedOrder = undefined;
    this.description = '';
    this.selectedUser = null;
  }
  
  
  
  
}
