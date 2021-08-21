import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DigiResult } from "../models/digiresult";

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
    addUtilisateur(utilisateur: Utilisateur): Observable<DigiResult<Utilisateur>> {
        let stringifyItem = JSON.stringify(utilisateur);
        return this._httpClient.post<DigiResult<Utilisateur>>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un utilisateur
     * @param utilisateur 
     */
    updateUtilisateur(utilisateur: object): Observable<DigiResult<Utilisateur>> {
        let stringifyItem = JSON.stringify(utilisateur);
        return this._httpClient.patch<DigiResult<Utilisateur>>(this._apiname + utilisateur['Id'] + '/', stringifyItem, this._httpOptions);
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
    * @returns Observable<DigiResult<Utilisateur[]>>
    */
    getUtilisateurs(): Observable<DigiResult<Utilisateur[]>> {
        return this._httpClient.get<DigiResult<Utilisateur[]>>(this._apiname);
    }

    /**
     * Obtenir un utilisateur
     * @param idUtilisateur 
     */
    getUtilisateur(idUtilisateur): Observable<DigiResult<Utilisateur>> {
        return this._httpClient.get<DigiResult<Utilisateur>>(this._apiname + idUtilisateur);
    }
    
    /**
     * Suppression d'un utilisateur par son id
     * 
     * @param idUtilisateur 
     * @returns Observable<DigiResult<boolean>>
     */
    deleteUtilisateur(idUtilisateur): Observable<DigiResult<boolean>> {
        return this._httpClient.delete<DigiResult<boolean>>(this._apiname + idUtilisateur, this._httpOptions);
    }
}
