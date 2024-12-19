import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/demo/service/user.service';
import { FileUpload } from 'primeng/fileupload'; // Import nécessaire pour p-fileUpload

@Component({
    templateUrl: './panelsdemo.component.html',
    styleUrls: ['./panelsdemo.component.css']
})
export class PanelsDemoComponent implements OnInit, OnDestroy {
    email: string = '';
    token: string = '';
    errorMessage: string = '';
    successMessage: string = '';
    userEmail: string | null = '';
    selectedFile: File | null = null;
    avatarPreview: string | ArrayBuffer | null = null;

    // Variables pour la gestion du glissement
    private startX: number = 0;
    private startY: number = 0;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private isDragging: boolean = false;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            const emailFromParams = params['email'];
            this.userEmail = emailFromParams ? emailFromParams : localStorage.getItem('userEmail');
    
            if (!this.token) {
                console.error('Token is missing.');
            }
        });

        // Initialiser les écouteurs d'événements pour le glissement de l'image
        const imageElement = document.getElementById('draggable-image');
        if (imageElement) {
            imageElement.addEventListener('mousedown', this.onDragStart.bind(this));
            imageElement.addEventListener('touchstart', this.onDragStart.bind(this));

            window.addEventListener('mousemove', this.onDrag.bind(this));
            window.addEventListener('touchmove', this.onDrag.bind(this));

            window.addEventListener('mouseup', this.onDragEnd.bind(this));
            window.addEventListener('touchend', this.onDragEnd.bind(this));
        }
    }

    ngOnDestroy(): void {
        // Nettoyer les écouteurs d'événements pour éviter les fuites de mémoire
        const imageElement = document.getElementById('draggable-image');
        if (imageElement) {
            imageElement.removeEventListener('mousedown', this.onDragStart.bind(this));
            imageElement.removeEventListener('touchstart', this.onDragStart.bind(this));

            window.removeEventListener('mousemove', this.onDrag.bind(this));
            window.removeEventListener('touchmove', this.onDrag.bind(this));

            window.removeEventListener('mouseup', this.onDragEnd.bind(this));
            window.removeEventListener('touchend', this.onDragEnd.bind(this));
        }
    }

    // Méthode pour gérer la sélection d'image avec p-fileUpload
    onImageSelect(event: any): void {
        const file = event.files[0];
        if (file) {
            this.selectedFile = file;
            const reader = new FileReader();
    
            // Vérifiez que selectedFile est non nul avant de continuer
            if (this.selectedFile) {
                reader.onload = () => {
                    this.avatarPreview = reader.result;
                    // Réinitialiser le positionnement de l'image lorsqu'une nouvelle image est sélectionnée
                    this.resetImagePosition();
                };
    
                // Maintenant, selectedFile est garanti d'être non nul
                reader.readAsDataURL(this.selectedFile);
            }
        }
    }
    

    onSubmit(): void {
        if (!this.selectedFile) {
            this.errorMessage = 'Please select an avatar image.';
            return;
        }

        const email = this.userEmail ? this.userEmail : '';

        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('email', email);
        formData.append('avatar', this.selectedFile);

        this.userService.updateAvatar(formData).subscribe(
            response => {
                this.successMessage = 'Avatar updated successfully.';
                this.errorMessage = '';
                
                // Rediriger vers le tableau de bord après une mise à jour réussie
                setTimeout(() => {
                    this.router.navigate(['/dashboard']); // Mettez à jour le chemin du tableau de bord
                }, 2000); // Attendez 2 secondes avant de rediriger pour montrer le message de succès
            },
            error => {
                this.errorMessage = 'Error updating avatar. Please try again.';
                this.successMessage = '';
            }
        );
    }

    onDragStart(event: MouseEvent | TouchEvent): void {
        if (event instanceof MouseEvent) {
            this.startX = event.clientX - this.offsetX;
            this.startY = event.clientY - this.offsetY;
        } else if (event instanceof TouchEvent) {
            const touch = event.touches[0];
            this.startX = touch.clientX - this.offsetX;
            this.startY = touch.clientY - this.offsetY;
        }

        this.isDragging = true;
        const imageElement = document.getElementById('draggable-image');
        if (imageElement) {
            imageElement.classList.add('dragging');
        }
    }

    onDrag(event: MouseEvent | TouchEvent): void {
        if (!this.isDragging) return;

        let clientX, clientY;

        if (event instanceof MouseEvent) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else if (event instanceof TouchEvent) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        }

        if (clientX !== undefined && clientY !== undefined) {
            this.offsetX = clientX - this.startX;
            this.offsetY = clientY - this.startY;

            // Limitez le déplacement dans les limites du conteneur
            this.updateImagePosition();
        }
    }

    onDragEnd(): void {
        this.isDragging = false;
        const imageElement = document.getElementById('draggable-image');
        if (imageElement) {
            imageElement.classList.remove('dragging');
        }
    }

    updateImagePosition(): void {
        const imageElement = document.getElementById('draggable-image');
        const container = document.querySelector('.image-container');

        if (imageElement && container) {
            const containerRect = container.getBoundingClientRect();
            const imageRect = imageElement.getBoundingClientRect();

            // Calculer les limites pour restreindre le mouvement de l'image
            const maxX = containerRect.width - imageRect.width;
            const maxY = containerRect.height - imageRect.height;

            // Appliquer les limites
            const newX = Math.max(Math.min(this.offsetX, 0), maxX);
            const newY = Math.max(Math.min(this.offsetY, 0), maxY);

            imageElement.style.transform = `translate(${newX}px, ${newY}px)`;
        }
    }

    resetImagePosition(): void {
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateImagePosition();
    }
}
