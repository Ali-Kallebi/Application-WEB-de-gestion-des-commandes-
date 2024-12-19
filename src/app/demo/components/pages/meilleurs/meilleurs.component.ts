import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/demo/service/user.service';
import { User } from 'src/app/demo/api/user';
import { EmailService } from 'src/app/demo/service/email.service';
import { CommandeService } from 'src/app/demo/service/commande.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-meilleurs',
  templateUrl: './meilleurs.component.html',
  styleUrls: ['./meilleurs.component.scss']
})
export class MeilleursComponent implements OnInit, OnDestroy {
  users: User[] = [];
  selectedUsers: User[] = [];
  draggedUser: User | null = null;
  lineData: any;
  lineOptions: any;
  subscription!: Subscription;
  role:any;

  constructor(
    private userService: UserService,
    private emailService: EmailService,
    private commandeService: CommandeService,
    public layoutService: LayoutService
  ) {
    this.subscription = this.layoutService.configUpdate$.subscribe(() => {
      this.initCharts();
    });
  }

  ngOnInit() {
    this.getAllUsers();
    this.initCharts();
    this.loadSummaryData();
    this.role = localStorage.getItem('role')
  }

  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }

  getAllUsers() {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users.filter(user => user.specialite !== 'RH');
        this.users.sort((a, b) => a.periode - b.periode);
        this.users.forEach((user, index) => {
          user.rank = index + 1;
        });
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  sendMeilleurOuvrierEmail() {
    this.emailService.sendMeilleurOuvrierEmail().subscribe(
      (response) => {
        console.log('E-mails envoyés avec succès.');
      },
      (error) => {
        console.error('Une erreur s\'est produite lors de l\'envoi des e-mails:', error);
      }
    );
  }

  dragStart(user: User) {
    this.draggedUser = user;
  }

  dragEnd() {
    this.draggedUser = null;
  }

  drop(event: any) {
    if (this.draggedUser) {
      this.selectedUsers = [...this.selectedUsers, this.draggedUser];
      this.users = this.users.filter(user => user !== this.draggedUser);
      this.draggedUser = null;
    }
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: [surfaceBorder],
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: [surfaceBorder],
            drawBorder: false
          }
        }
      }
    };
  }

  loadSummaryData() {
    this.commandeService.getUsers().subscribe(data => {
      console.log('Users Data:', data);
      this.updateChartData(data);
    });
  }

  updateChartData(users: User[]) {
    const documentStyle = getComputedStyle(document.documentElement);
    const filteredUsers = users.filter(user => user.specialite !== 'RH');

    const chartLabels = filteredUsers.map((user: User) => `${user.nom} ${user.prenom}`);
    const firstDatasetData = filteredUsers.map(user => user.periode / 60);
    const secondDatasetData = filteredUsers.map(user => user.nombreCommandesTerminees);

    this.lineData = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Période en H',
          data: firstDatasetData,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
          borderColor: documentStyle.getPropertyValue('--bluegray-700'),
          tension: .4
        },
        {
          label: 'Nombre de Commandes Terminées',
          data: secondDatasetData,
          fill: false,
          backgroundColor: documentStyle.getPropertyValue('--green-600'),
          borderColor: documentStyle.getPropertyValue('--green-600'),
          tension: .4
        }
      ]
    };
  }
}
