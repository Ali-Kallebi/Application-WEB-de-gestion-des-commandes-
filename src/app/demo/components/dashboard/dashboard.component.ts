import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Produit } from '../../api/produit';
import { ProduitService } from '../../service/produit.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { CommandeService } from '../../service/commande.service';
import { UserService } from '../../service/user.service';
import { User } from '../../api/user';
import { Router } from '@angular/router';
import { Commande } from '../../api/commande';


@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];
    produits!: Produit[];
    produit: Produit = {};
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;
    stats: any = {}; 
    clientStats: any = {}; 
    selectedUser: User | undefined;
    displayUserDialog: boolean = false;
    commentaireStats: any = {};
    users: User[] = []; 
    user: User = {};
    selectedUserId: string | undefined;
    selectedUserDetails: User | undefined; 
    summaryData: any = {};
    commandesEnAttente: Commande[] = [];
    index: number = 0;
    searchText: string = '';
    lineData: any;
    barData: any;
    polarData: any;
    radarData: any;
    doughnutData: any;
    barOptions: any;
    

    
   

    constructor(
        private commandeService: CommandeService,
        private userService: UserService,
        private produitService: ProduitService,
        public layoutService: LayoutService,
        private router: Router,
    ) {
       
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initCharts();
        });
    }

    ngOnInit() {
        
        this.loadCommandesEnAttente();
        this.loadSummary();
        this.initCharts();
        this.loadSummaryData();
        

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
      
        
        this.getAllProduits();
        
    }

    getAllUsers() {
        this.userService.getUsers().subscribe(
            (data: User[]) => {
                this.users = data;
            },
            (error) => {
                console.error('Error fetching users:', error);
            }
        );
    }
    getAllProduits(): void {
        this.produitService.getProduits().subscribe(
            (data: Produit[]) => {
                this.produits = data;
            },
            (error) => {
                console.error('Error fetching products:', error);
            }
        );
    }
    
    loadSummary() {
        this.commandeService.getSummary().subscribe(
            (data: any) => {
                this.summaryData = data;
                
            },
            (error) => {
                console.error('Error loading summary:', error);
            }
        );
    }
    loadCommandesEnAttente() {
        this.commandeService.getCommandesEnAttente().subscribe(
            (data: Commande[]) => {
                this.commandesEnAttente = data;
            },
            (error) => {
                console.error('Erreur lors de la récupération des commandes en attente:', error);
            }
        );
    }
    afficherPlus(): void {
        this.index += 10; // Incrémente l'index pour afficher les 10 prochaines commandes
      }
    
      precedent(): void {
        this.index -= 10; // Décrémente l'index pour afficher les 10 commandes précédentes
      }
    
      search(): void {
        if (this.searchText.trim() === '') {
            // Si le champ de recherche est vide, réinitialiser les commandes en attente
            this.loadCommandesEnAttente();
        } else {
            // Filtrer les commandes en fonction du texte de recherche
            this.commandesEnAttente = this.commandesEnAttente.filter(commande =>
                // Remplacez les propriétés par celles que vous souhaitez filtrer
                commande.nomClient.toLowerCase().includes(this.searchText.toLowerCase()) ||
                commande.prenomClient.toLowerCase().includes(this.searchText.toLowerCase()) ||
                commande.localisation.toLowerCase().includes(this.searchText.toLowerCase())
            );
        }
    }
    
  
    navigateToTable(commandeId: number) {
        this.router.navigate(['/uikit/table'], { queryParams: { id: commandeId } });
    }
    navigateToExternalLink(): void {
        window.open('https://asmpos.com/packs/', '_blank');
    }
    

      navigateToRegistre(): void {
        this.router.navigate(['/auth/register']);
      }
     

     
  
      
    
  
      initCharts() {
          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue('--text-color');
          const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
          const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
  
      }
      
  
      loadSummaryData() {
          this.commandeService.getSummary().subscribe(data => {
              console.log('Summary Data:', data); // Vérifiez les données reçues
              this.updateChartData(data.commandesParDate, data.produitCommandes, data.packCommandes);
          });
      }
      
  
      updateChartData(commandesParDate: any[], produitCommandes: any[], packCommandes: any[]) {
          const documentStyle = getComputedStyle(document.documentElement);
          const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
          
          const chartLabels = commandesParDate.map(cmd => monthNames[cmd.month - 1]);
          const firstDatasetData = commandesParDate.map(cmd => cmd.totalCommandes);
          const secondDatasetData = commandesParDate.map(cmd => cmd.totalClients);
      
          this.barData = {
              labels: chartLabels,
              datasets: [
                  {
                      label: 'Total Commandes',
                      backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                      borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                      data: firstDatasetData
                  },
                  {
                      label: 'Total Clients',
                      backgroundColor: documentStyle.getPropertyValue('--green-600'),
                      borderColor: documentStyle.getPropertyValue('--green-600'),
                      data: secondDatasetData
                  }
              ]
          };
      
          this.lineData = {
              labels: chartLabels,
              datasets: [
                  {
                      label: 'Total Commandes',
                      data: firstDatasetData,
                      fill: false,
                      backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                      borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                      tension: .4
                  },
                  {
                      label: 'Total Clients',
                      data: secondDatasetData,
                      fill: false,
                      backgroundColor: documentStyle.getPropertyValue('--green-600'),
                      borderColor: documentStyle.getPropertyValue('--green-600'),
                      tension: .4
                  }
              ]
          };
      
        }
      
      ngOnDestroy() {
          if (this.subscription) {
              this.subscription.unsubscribe();
          }
      }
    }