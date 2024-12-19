import { Component, OnInit } from '@angular/core';
import { Produit } from 'src/app/demo/api/produit';
import { ProduitService } from 'src/app/demo/service/produit.service';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {
   
  
    constructor(private produitService: ProduitService, private messageService: MessageService) { }
  
    ngOnInit() {
     
    }
  
  }