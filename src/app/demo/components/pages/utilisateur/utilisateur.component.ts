import { Component, OnInit, NgZone } from '@angular/core';
import { User } from 'src/app/demo/api/user';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/demo/service/user.service';


@Component({
    templateUrl: './utilisateur.component.html',
    styles: [`
    .error-message{
        color: #632112; /* Couleur personnalisée */
    }
`],
    providers: [MessageService, UserService]
})
export class UtilisateurComponent implements OnInit {

    userDialog: boolean = false;
    deleteUserDialog: boolean = false;
    deleteUsersDialog: boolean = false;
    users: User[] = [];
    user: User = {};
    selectedUsers: User[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    specialiteOptions: any[] = [];
    localisationOptions: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    role:any;

    constructor(private userService: UserService, private messageService: MessageService) { }

    ngOnInit(): void {
        this.getAllUser();
        this.role = localStorage.getItem('role')
      
        this.cols = [
            { field: 'nom', header: 'Nom' },
            { field: 'prenom', header: 'Prenom' },
            { field: 'email', header: 'Mail' },
            { field: 'specialite', header: 'Specialite' },
            { field: 'localisation', header: 'Localisation' },
            { field: 'tel', header: 'Tel' }  // Added Tel column
        ];

        this.specialiteOptions = [
            { label: 'RH', value: 'RH' },
            { label: 'Technicien', value: 'Technicien' },
            { label: 'Intégrateur', value: 'Intégrateur' }
        ];

        this.localisationOptions = [
            { label: 'Sfax Im.El Itkan', value: 'Sfax Im.El Itkan' },
            { label: 'Sfax Imm.Aziza', value: 'Sfax Imm.Aziza' },
            { label: 'Sousse', value: 'Sousse' },
            { label: 'Tunisie', value: 'Tunisie' }
        ];
    }

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.deleteUsersDialog = true;
    }

    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteUser(user: User) {
        this.deleteUserDialog = true;
        this.user = { ...user };
    }
    handleKeyPress(event: KeyboardEvent) {
        const charCode = event.which ? event.which : event.keyCode;
        const inputValue = (event.target as HTMLInputElement).value;
        if (charCode > 31 && (charCode < 48 || charCode > 57) || inputValue.length >= 8) {
            event.preventDefault();
        }
    }
    
    

    confirmDeleteSelectedUsers() {
        this.deleteUsersDialog = false;
    
        // Parcourir tous les utilisateurs sélectionnés et les supprimer un par un
        this.selectedUsers.forEach(selectedUser => {
            // Supprimer l'utilisateur actuel via le service UserService
            this.userService.deleteUser(selectedUser.id , this.user).then(() => {
                // Filtrer l'utilisateur supprimé du tableau users
                this.users = this.users.filter(val => val.id !== selectedUser.id);
                // Ajouter un message de succès
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
                // Effacer les utilisateurs sélectionnés après la suppression
                this.selectedUsers = [];
            }, error => {
                console.error('Error deleting user:', error);
                // Gérer les erreurs de suppression d'utilisateurs
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting user', life: 3000 });
            });
        });
    }
    

    confirmDeleteUser() {
        this.deleteUserDialog = false;
        this.userService.deleteUser(this.user.id , this.user).then(() => {
            this.users = this.users.filter(val => val.id !== this.user.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            this.user = {};
        });
    }

    hideUserDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    async saveUser() {
        this.submitted = true;
        let isValid = true; // Variable pour vérifier la validité des champs
    
        // Vérification du champ nom
        if (!this.user.nom || !/^[a-zA-Z]+$/.test(this.user.nom.trim())) {
            isValid = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Nom doit contenir uniquement des lettres.', life: 3000 });
        }
    
        // Vérification du champ prénom
        if (!this.user.prenom || !/^[a-zA-Z]+$/.test(this.user.prenom.trim())) {
            isValid = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Prénom doit contenir uniquement des lettres.', life: 3000 });
        }
    
        // Vérification du champ mail
        if (!this.user.email || !/\S+@\S+\.\S+/.test(this.user.email.trim())) {
            isValid = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mail doit être au format exemple@domaine.com.', life: 3000 });
        }
    
        // Vérification du champ téléphone
        if (!this.user.tel || !/^\d{8}$/.test(this.user.tel.trim())) {
            isValid = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Téléphone est obligatoire et doit contenir 8 chiffres.', life: 3000 });
        }
    
        // Vérification de la spécialité
        if (!this.user.specialite) {
            isValid = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Spécialité est obligatoire.', life: 3000 });
        }
    
        // Vérification de la localisation
        if (!this.user.localisation) {
            isValid = false;
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Localisation est obligatoire.', life: 3000 });
        }
    
        if (isValid) {
            this.submitted = false;
    
            if (this.user.id) {
                this.users[this.findIndexById(this.user.id)] = this.user;
                this.userService.updateUser(this.user.id, this.user).then(res => {
                    console.log('*****')
                })
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur mis à jour.', life: 3000 });
            } else {
                await this.userService.createUser(this.user).then(res => {
                    console.log('+++++', res)
                })
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur créé.', life: 3000 });
                await this.getAllUser();
            }
    
            this.users = [...this.users];
            this.userDialog = false;
            this.user = {};
        }
    }
    
    

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

  

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getAllUser() { 
        this.userService.getUsers().subscribe(
            (data: User[]) => {
              this.users = data;
            },
            (error) => {
              console.error('Error fetching users:', error);
              // Gérer l'erreur selon vos besoins
            }
          );
    }
}
