import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UtilisateurBackendService {
    private readonly _apiroute = 'http://localhost:8000/api/';
    private readonly _apiname = this._apiroute + 'utilisateurs/';
    

    constructor(
        private _httpClient: HttpClient
    ) {
    }

    /**
     * Ajouter un utilisateur
     * @param utilisateur 
     * @return : {Observable}
     */
    addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {

        let stringifyItem = JSON.stringify(utilisateur);

        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-CSRFToken': 'affdv4w7KcFALMacAsU4FC27iuRZBwJcLEZTDFqjB5w3EkxlZ39Jh56O8mDttmBO'
            })
        };

        return this._httpClient.post<Utilisateur>(this._apiname, stringifyItem, httpOptions);
    }

    /**
     * Modifier un utilisateur
     * @param utilisateur 
     */
    updateUtilisateur(utilisateur: object): Observable<Utilisateur> {
        let stringifyItem = JSON.stringify(utilisateur);

        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-CSRFToken': 'affdv4w7KcFALMacAsU4FC27iuRZBwJcLEZTDFqjB5w3EkxlZ39Jh56O8mDttmBO'
            })
        };

        return this._httpClient.patch<Utilisateur>(this._apiname + utilisateur['Id'] + '/', stringifyItem, httpOptions);
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
}