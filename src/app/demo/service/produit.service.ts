import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Produit } from '../api/produit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private apiUrl = 'http://127.0.0.1:8000/api/produits';
  private uploadImageUrl = 'http://127.0.0.1:8000/api/upload-image';

  constructor(private http: HttpClient) { }

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl)
      .pipe(
        map((produits: Produit[]) => {
          return produits.map(produit => ({
            ...produit,
            selectedImage: produit.image ? `${this.apiUrl}/${produit.image}` : null
          }));
        }),
        catchError(this.handleError)
      );
  }

  getProduit(id: number): Observable<Produit> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Produit>(url)
      .pipe(catchError(this.handleError));
  }

  
  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit)
        .pipe(catchError(this.handleError));
  }

  updateProduit(id: number, produit: Produit): Observable<Produit> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Produit>(url, produit)
        .pipe(catchError(this.handleError));
  }

  deleteProduit(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred', error);
    return throwError('Something went wrong; please try again later.');
  }
}
