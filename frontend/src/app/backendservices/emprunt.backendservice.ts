import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Emprunt } from '../models/emprunt';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DigiResult } from "../models/digiresult";

@Injectable()
export class EmpruntBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'emprunts/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) {}

    /**
     * Ajouter un emprunt
     * @param emprunt 
     * @return : {Observable}
     */
    addEmprunt(emprunt: Emprunt): Observable<DigiResult<Emprunt>> {
        let stringifyItem = JSON.stringify(emprunt);
        return this._httpClient.post<DigiResult<Emprunt>>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un emprunt
     * @param emprunt 
     */
    updateEmprunt(emprunt: object): Observable<DigiResult<Emprunt>> {
        let stringifyItem = JSON.stringify(emprunt);
        return this._httpClient.put<DigiResult<Emprunt>>(this._apiname + emprunt['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
     * Modifier partiellement un emprunt
     * @param emprunt 
     */
    partialUpdateEmprunt(emprunt: object): Observable<DigiResult<Emprunt>> {
        let stringifyItem = JSON.stringify(emprunt);
        return this._httpClient.patch<DigiResult<Emprunt>>(this._apiname + emprunt['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les emprunt
    * @returns : Observable<Emprunt[]>
    */
    getEmprunts(): Observable<DigiResult<Emprunt[]>> {
        return this._httpClient.get<DigiResult<Emprunt[]>>(this._apiname);
    }

    /**
    * Obtenir les emprunt d'un utilisateur
    * @returns : Observable<Emprunt[]>
    */
    getEmpruntsByOwner(idOwner): Observable<DigiResult<Emprunt[]>> {
        let params = new HttpParams()
            .set('id', idOwner);

        return this._httpClient.get<DigiResult<Emprunt[]>>(this._apiname + 'list-by-owner', {params: params});
    }

    /**
     * Obtenir un emprunt
     * @param idEmprunt 
     */
    getEmprunt(idEmprunt): Observable<DigiResult<Emprunt>> {
        return this._httpClient.get<DigiResult<Emprunt>>(this._apiname + idEmprunt);
    }
    
    /**
     * Suppression d'un emprunt par son id
     * 
     * @param idEmprunt 
     * @returns 
     */
    deleteEmprunt(idEmprunt): Observable<DigiResult<boolean>> {
        return this._httpClient.delete<DigiResult<boolean>>(this._apiname + idEmprunt, this._httpOptions);
    }
}
