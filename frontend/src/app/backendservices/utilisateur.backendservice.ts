import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { UtilisateurListComponent } from '../components/utilisateur/utilisateur-list.component';
import { Utilisateur } from '../models/utilisateur';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UtilisateurBackendService {
    private readonly _apiname = 'Utilisateur';
    private readonly _utilisateurUrl = 'http://localhost:8000/api/utilisateurs/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private http: HttpClient) {}
    

    /**
     * Ajout d'un utilisateur
     * 
     * @param {Object} utilisateur : l'utilisateur
     * @returns : {Observable}
     */
    addUtilisateur(utilisateur: Utilisateur) { //: Observable<Utilisateur>{
        JSON.stringify(utilisateur); // ToDo
    }

    /**
     * Récupération de la liste des utilisateurs
     * 
     * @returns : Observable<Utilisateur[]>
     */
    getUtilisateurs(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(this._utilisateurUrl);
    }

    /**
     * Récupération d'un utilisateur par id
     * 
     * @returns : Observable<Utilisateur[]>
     */
    getUtilisateurById(utilisateurId): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(this._utilisateurUrl + utilisateurId);
    }

    /**
     * Suppression d'un utilisateur par son id
     * 
     * @param idUtilisateur 
     * @returns 
     */
    deleteUtilisateur(idUtilisateur) {
        return this.http.delete(this._utilisateurUrl + idUtilisateur, this._httpOptions);
}
}