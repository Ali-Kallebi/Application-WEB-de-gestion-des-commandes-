import { Component, OnInit } from '@angular/core';
import { Produit } from 'src/app/demo/api/produit';
import { ProduitService } from 'src/app/demo/service/produit.service';
import { MessageService } from 'primeng/api';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

@Component({
  templateUrl: './produit.component.html',
  styles: [`
  .error-message {
      color: #632112; /* Custom color */
  }
  `],
  providers: [MessageService]
})
export class ProduitComponent implements OnInit {
    produits: Produit[] = [];
    produit: Produit = {};
    produitsSelectionnes: Produit[] = [];
    produitDialog: boolean = false;
    deleteProduitDialog: boolean = false;
    deleteProduitsDialog: boolean = false;
    soumis: boolean = false;
    cols: any[] = [];
    statuts: any[] = [];
    optionsLignesParPage: number[] = [5, 10, 20];
    selectedProduits: Produit[] = [];
    categories: string[] = ['Pro Caisse', 'Pro Resto', 'Desk Top', 'Web'];
    dt: any;
    selectedFile: File | null = null;
    selectedImage: SafeUrl | ArrayBuffer | null | undefined;
    role : any;

    constructor(private produitService: ProduitService,
                private messageService: MessageService,
                private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.produitService.getProduits().subscribe((data: Produit[]) => {
            this.produits = data;
            console.log(this.produits); 
          });
          this.role = localStorage.getItem('role')
        this.cols = [
            { field: 'code', header: 'Code' },
            { field: 'nom', header: 'Name' },
            { field: 'prix', header: 'Price' },
            { field: 'categorie', header: 'Category' },
            { field: 'note', header: 'Reviews' },
            { field: 'statutInventaire', header: 'Status' },
            { field: 'selectedImage', header: 'Image' },
        ];

        this.statuts = [
            { label: 'En stock', value: 'En stock' },
            { label: 'Bas stock', value: 'Bas stock' },
            { label: 'Hors stock', value: 'Hors stock' }
        ];
    }

    openNew() {
        this.produit = {};
        this.soumis = false;
        this.produitDialog = true;
    }

    deleteSelectedProduits() {
        this.deleteProduitsDialog = true;
    }

    editProduit(produit: Produit) {
        this.produit = { ...produit };
        this.produitDialog = true;
    }

    deleteProduit(produit: Produit) {
        this.deleteProduitDialog = true;
        this.produit = { ...produit };
    }

    hideDialog() {
        this.produitDialog = false;
        this.soumis = false;
    }

    onStatutChange(event: any) {
        this.produit.statutInventaire = event.value.value;
    }

    
    onImageSelect(event: any) {
        const file = event.files[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.produit.image = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }
    
    saveProduit() {
        this.soumis = true;
    
        if (this.produit.nom?.trim()) {
            const produitData = { ...this.produit };
    
            if (produitData.id) {
                this.updateProduit(produitData);
            } else {
                this.createProduit(produitData);
            }
        }
    }
    
    createProduit(produit: Produit) {
        this.produitService.createProduit(produit).subscribe((newProduit) => {
            this.produits.push(newProduit);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            this.produits = [...this.produits];
            this.produitDialog = false;
            this.produit = {};
        });
    }
    
    updateProduit(produit: Produit) {
        this.produitService.updateProduit(produit.id!, produit).subscribe(() => {
            this.produits[this.findIndexById(produit.id!)] = produit;
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            this.produits = [...this.produits];
            this.produitDialog = false;
            this.produit = {};
        });
    }
    

    refreshProducts() {
        this.produitService.getProduits().subscribe(data => {
            this.produits = data;
        });
    }

    findIndexById(id: number): number {
        return this.produits.findIndex(produit => produit.id === id);
    }

    confirmDeleteProduit() {
        this.produitService.deleteProduit(this.produit.id!).subscribe(() => {
            this.produits = this.produits.filter(val => val.id !== this.produit.id);
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            this.deleteProduitDialog = false;
            this.produit = {};
        });
    }

    confirmDeleteProduits() {
        this.produitsSelectionnes.forEach(produit => {
            this.produitService.deleteProduit(produit.id!).subscribe(() => {
                this.produits = this.produits.filter(val => val.id !== produit.id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            });
        });
        this.deleteProduitsDialog = false;
        this.produitsSelectionnes = [];
    }

    onSearchInput(event: any) {
        const searchTerm = event.target.value;
        this.dt.filterGlobal(searchTerm, 'contains');
    }
}
