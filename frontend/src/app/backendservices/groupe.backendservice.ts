import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Groupe } from '../models/groupe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DigiResult } from "../models/digiresult";

@Injectable()
export class GroupeBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'groupes/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) { }

    /**
     * Ajouter un groupe
     * @param groupe 
     * @return : {Observable}
     */
    addGroupe(groupe: Groupe): Observable<DigiResult<Groupe>> {
        let stringifyItem = JSON.stringify(groupe);
        return this._httpClient.post<DigiResult<Groupe>>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un groupe
     * @param groupe 
     */
    updateGroupe(groupe: object): Observable<DigiResult<Groupe>> {
        let stringifyItem = JSON.stringify(groupe);
        return this._httpClient.put<DigiResult<Groupe>>(this._apiname + groupe['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les groupes
    * @returns : Observable<Groupe[]>
    */
    getGroupes(): Observable<DigiResult<Groupe[]>> {
        return this._httpClient.get<DigiResult<Groupe[]>>(this._apiname);
    }

    /**
     * Obtenir un groupe
     * @param idGroupe 
     */
    getGroupe(idGroupe): Observable<DigiResult<Groupe>> {
        return this._httpClient.get<DigiResult<Groupe>>(this._apiname + idGroupe);
    }

    /**
     * Suppression d'un groupe par son id
     * @param idGroupe 
     * @returns : Observable<boolean>
     */
    deleteGroupe(idGroupe): Observable<DigiResult<boolean>> {
        return this._httpClient.delete<DigiResult<boolean>>(this._apiname + idGroupe, this._httpOptions);
    }
}
