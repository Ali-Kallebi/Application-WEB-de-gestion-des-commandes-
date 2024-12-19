import { Component, OnInit } from '@angular/core';
import { CommandeService } from 'src/app/demo/service/commande.service';
import { Commande } from 'src/app/demo/api/commande';
import { HttpClient } from '@angular/common/http';
import { EmailService } from 'src/app/demo/service/email.service';
import { UserService } from 'src/app/demo/service/user.service';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css']
})
export class MissionComponent implements OnInit {
  commandes: Commande[] = [];
  filteredEnCoursCommandes: Commande[] = [];
  filteredTermineesCommandes: Commande[] = [];
  filteredRejeteesCommandes: Commande[] = [];
  selectedCommande: Commande | null = null;
  searchTermEnCours: string = '';
  searchTermTerminees: string = '';
  searchTermRejetees: string = '';
  enCoursTarget: Commande[] = [];
  termineesTarget: Commande[] = [];
  rejeteesTarget: Commande[] = [];
  displayCommandeDetailsDialog: boolean | undefined;
  showRejectModal: boolean = false;
  rejectionReason: string = '';
  rejectionDate: Date = new Date();
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  selectedCommandeDetails: any;
  selectedUserId: number | null = null; 
  displayCalendarDialog: boolean = false;
  
  
  constructor(private commandeService: CommandeService,
     private http: HttpClient,
     private emailService: EmailService,
     private userService: UserService,
     private cdr: ChangeDetectorRef
    ) { }


  ngOnInit(): void {
    this.loadCommandesEnCours();
    this.loadCommandesTerminees();
    this.loadCommandesRejetees();
  }

  loadCommandesEnCours(): void {
    // Récupérer l'id de l'utilisateur connecté depuis le localStorage
    const idUser = localStorage.getItem('idUser');

    if (idUser) {
      this.commandeService.getCommandesByStatus('En cours').subscribe(
        (commandes: Commande[]) => {
          // Filtrer les commandes en cours pour afficher uniquement celles associées à l'utilisateur connecté
          this.filteredEnCoursCommandes = commandes.filter(commande => commande.userId === +idUser);
          // Autres actions...
        },
        (error) => {
          console.error('Erreur lors du chargement des commandes en cours :', error);
        }
      );
    }
  }
  
  

  loadCommandesTerminees(): void {
    const idUser = localStorage.getItem('idUser');

    if (idUser) {
      this.commandeService.getCommandesByStatus('Terminé').subscribe(
        (commandes: Commande[]) => {
          this.filteredTermineesCommandes = commandes.filter(commande => commande.userId === +idUser);
        },
        (error) => {
          console.error('Erreur lors du chargement des commandes terminées :', error);
        }
      );
    }
  }

  loadCommandesRejetees(): void {
    const idUser = localStorage.getItem('idUser');

    if (idUser) {
      this.commandeService.getCommandesByStatus('En attente').subscribe(
        (commandes: Commande[]) => {
          this.filteredRejeteesCommandes = commandes.filter(commande => commande.userId === +idUser);
        },
        (error) => {
          console.error('Erreur lors du chargement des commandes rejetées :', error);
        }
      );
    }
  }
  showCommandeDetails(commande: Commande): void {
    this.selectedCommande = commande;
    // Assurez-vous que selectedCommandeDetails est correctement assigné
    this.selectedCommandeDetails = commande;
  }
  
  
  

 
  

  showRejectModalWindow(): void {
    this.showRejectModal = true;
  }
  showTermine(): void {
    this.displayCalendarDialog = true;
  }
  cancelTermine(): void {
    this.displayCalendarDialog = false;
  }

  cancelReject(): void {
    this.showRejectModal = false;
  }

  terminerCommande(): void {
    if (this.selectedCommande) {
      const commandeId = this.selectedCommande.id;
      const dateDebut = this.dateDebut;
      const dateFin = this.dateFin;
      // Mettre à jour le statut de la commande à "Terminé"
      this.updateCommandeStatus(this.selectedCommande, 'Terminé', this.filteredEnCoursCommandes, this.filteredTermineesCommandes);
  
      // Envoyer un e-mail pour notifier la commande terminée
      this.sendMailTerminee(commandeId, dateDebut, dateFin); 
      this.commandeService.termineCommande(commandeId, dateDebut, dateFin).subscribe(
        () => {
            console.log('Raison de rejet et date enregistrées avec succès.');
            this.cdr.detectChanges(); // Détecter les changements après la mise à jour
        },
        
        (error) => {
            console.error('Erreur lors de l\'enregistrement de la raison de rejet et de la date :', error);
        }
    );
  
      // Fermer le dialogue de sélection des dates
      this.cancelTermine();
    }
  }
  



  rejectCommande(): void {
    if (this.selectedCommande && this.rejectionReason.trim() !== '') {
      const commandeId = this.selectedCommande.id;
      const rejectionReason = this.rejectionReason.trim();
      const rejectionDate = this.rejectionDate;
      const userId = this.selectedCommande.userId;
      const nomClient = this.selectedCommande.nomClient || 'Client inconnu'; // Utiliser 'Client inconnu' si nomClient est undefined
  
      // Mettre à jour le statut de la commande à 'En attente'
      this.updateCommandeStatus(this.selectedCommande, 'En attente', this.filteredEnCoursCommandes, this.filteredRejeteesCommandes);
      this.sendRejectionEmail(commandeId, rejectionReason, rejectionDate);
  
      // Enregistrer la raison du rejet et la date de rejet
      this.commandeService.rejectCommande(commandeId, rejectionReason, rejectionDate).subscribe(
        () => {
          console.log('Raison de rejet et date enregistrées avec succès.');
  
          if (userId) {
            this.userService.getUserById(userId).subscribe(
              (user) => {
                // Construction du titre de l'événement en utilisant les données récupérées
                const userNom = user?.nom || 'utilisateur inconnu';
                const userPrenom = user?.prenom || '';
                const eventData = {
                  title: `Report de commande de ${nomClient} par ${userNom} ${userPrenom}`,
                  start: rejectionDate.toISOString()
                };
  
                // Envoi des données à l'API pour ajouter l'événement
                this.http.post('http://127.0.0.1:8000/api/add-event', eventData).subscribe(
                  (response) => {
                    console.log('Événement ajouté au calendrier avec succès:', response);
                  },
                  (error) => {
                    console.error('Erreur lors de l\'ajout de l\'événement au calendrier:', error);
                  }
                );
              },
              (error) => {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
              }
            );
          }
        },
        (error) => {
          console.error('Erreur lors de l\'enregistrement de la raison de rejet et de la date :', error);
        }
      );
  
      this.cancelReject(); // Fermer le modal de rejet
    } else {
      console.error('La raison de rejet est requise.');
    }
  }
  
  
private sendMailTerminee(commandeId: number, dateDebut: Date, dateFin: Date): void {
  this.emailService.sendMailTerminee(commandeId, dateDebut, dateFin).subscribe(
      (response) => {
          console.log(`E-mail envoyé avec succès pour la commande rejetée (ID: ${commandeId})`);
      },
      (error) => {
          console.error(`Erreur lors de l'envoi de l'e-mail pour la commande rejetée (ID: ${commandeId}):`, error);
      }
  );
}



private sendRejectionEmail(commandeId: number, rejectionReason: string, rejectionDate: Date): void {
    this.emailService.sendMailRejetee(commandeId, rejectionReason, rejectionDate).subscribe(
        (response) => {
            console.log(`E-mail envoyé avec succès pour la commande rejetée (ID: ${commandeId})`);
        },
        (error) => {
            console.error(`Erreur lors de l'envoi de l'e-mail pour la commande rejetée (ID: ${commandeId}):`, error);
        }
    );
}


updateCommandeStatus(commande: Commande, newStatus: string, sourceList: Commande[], targetList: Commande[]): void {
  if (commande && commande.id) {
      this.commandeService.updateCommandeStatus(commande.id, newStatus).subscribe(
          () => {
              // Retirer la commande de la liste source
              const index = sourceList.indexOf(commande);
              if (index !== -1) {
                  sourceList.splice(index, 1);
              }

              // Ajouter la commande à la liste cible avec le nouveau statut
              commande.status = newStatus;
              targetList.push(commande);

              this.closeCommandeDetails();
              this.loadCommandesEnCours();
              this.loadCommandesTerminees();
              this.loadCommandesRejetees();
          },
          (error) => {
              console.error('Erreur lors de la mise à jour du statut de la commande :', error);
          }
      );
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
  fetchOrders() {
    throw new Error('Method not implemented.');
  }

  closeCommandeDetails(): void {
    this.selectedCommande = null;
    this.displayCommandeDetailsDialog = false;
    this.selectedUserId = null;
    this.selectedCommandeDetails = null;
  }

  filterEnCours(): void {
    this.filteredEnCoursCommandes = this.filterCommandes(this.commandes, this.searchTermEnCours);
  }

  filterTerminees(): void {
    this.filteredTermineesCommandes = this.filterCommandes(this.commandes, this.searchTermTerminees);
  }

  filterRejetees(): void {
    this.filteredRejeteesCommandes = this.filterCommandes(this.commandes, this.searchTermRejetees);
  }

  clearSearchTermEnCours(): void {
    this.searchTermEnCours = '';
    this.filterEnCours();
  }

  clearSearchTermTerminees(): void {
    this.searchTermTerminees = '';
    this.filterTerminees();
  }

  clearSearchTermRejetees(): void {
    this.searchTermRejetees = '';
    this.filterRejetees();
  }

  private filterCommandes(commandes: Commande[], searchTerm: string): Commande[] {
    if (!searchTerm) {
      return commandes;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    return commandes.filter(commande =>
      (commande.nomClient && commande.nomClient.toLowerCase().includes(lowerCaseSearch)) ||
      (commande.prenomClient && commande.prenomClient.toLowerCase().includes(lowerCaseSearch)) ||
      (commande.telClient && commande.telClient.toLowerCase().includes(lowerCaseSearch)) ||
      (commande.mailClient && commande.mailClient.toLowerCase().includes(lowerCaseSearch)) ||
      (commande.localisation && commande.localisation.toLowerCase().includes(lowerCaseSearch)) ||
      (commande.produitCommande && commande.produitCommande.toLowerCase().includes(lowerCaseSearch)) ||
      (commande.status && commande.status.toLowerCase().includes(lowerCaseSearch))
    );
  }
}
