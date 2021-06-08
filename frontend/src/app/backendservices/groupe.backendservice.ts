import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Groupe } from '../models/groupe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class GroupeBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'groupes/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) {}

    /**
     * Ajouter un groupe
     * @param groupe 
     * @return : {Observable}
     */
    addGroupe(groupe: Groupe): Observable<Groupe> {
        let stringifyItem = JSON.stringify(groupe);
        return this._httpClient.post<Groupe>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un groupe
     * @param groupe 
     */
    updateGroupe(groupe: object): Observable<Groupe> {
        let stringifyItem = JSON.stringify(groupe);
        return this._httpClient.put<Groupe>(this._apiname + groupe['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les groupe
    * @returns : Observable<Groupe[]>
    */
    getGroupes(): Observable<Groupe[]> {
        return this._httpClient.get<Groupe[]>(this._apiname);
    }

    /**
     * Obtenir un groupe
     * @param idGroupe 
     */
    getGroupe(idGroupe): Observable<Groupe> {
        return this._httpClient.get<Groupe>(this._apiname + idGroupe);
    }
    
    /**
     * Suppression d'un groupe par son id
     * 
     * @param idGroupe 
     * @returns 
     */
    deleteGroupe(idGroupe) {
        return this._httpClient.delete(this._apiname + idGroupe, this._httpOptions);
    }
}
