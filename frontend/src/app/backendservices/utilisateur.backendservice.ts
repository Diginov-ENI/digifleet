import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { UtilisateurListComponent } from '../components/utilisateur/utilisateur-list.component';
import { Utilisateur } from '../models/utilisateur';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UtilisateurBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'utilisateurs/';
    private readonly _apinamePassword = this._apiroute + 'change-password/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) {}

    /**
     * Ajouter un utilisateur
     * @param utilisateur 
     * @return : {Observable}
     */
    addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {
        let stringifyItem = JSON.stringify(utilisateur);
        return this._httpClient.post<Utilisateur>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un utilisateur
     * @param utilisateur 
     */
    updateUtilisateur(utilisateur: object): Observable<Utilisateur> {
        let stringifyItem = JSON.stringify(utilisateur);
        return this._httpClient.patch<Utilisateur>(this._apiname + utilisateur['Id'] + '/', stringifyItem, this._httpOptions);
    }
    /**
     * Modifier le mot de passe d'un utilisateur
     * @param utilisateur 
     */
     updatePasswordUtilisateur(utilisateur: object): Observable<Utilisateur> {
        let stringifyItem = JSON.stringify(utilisateur);



        return this._httpClient.patch<Utilisateur>(this._apinamePassword + utilisateur['Id'] + '/', stringifyItem, this._httpOptions);
    }
    /**
    * Obtenir les utilisateurs
    * @returns : Observable<Utilisateur[]>
    */
    getUtilisateurs(): Observable<Utilisateur[]> {
        return this._httpClient.get<Utilisateur[]>(this._apiname);
    }

    /**
     * Obtenir un utilisateur
     * @param id 
     */
    getUtilisateur(id): Observable<Utilisateur> {
        return this._httpClient.get<Utilisateur>(this._apiname + id);
    }
    
    /**
     * Suppression d'un utilisateur par son id
     * 
     * @param idUtilisateur 
     * @returns 
     */
    deleteUtilisateur(idUtilisateur) {
        return this._httpClient.delete(this._apiname + idUtilisateur, this._httpOptions);
    }
}
