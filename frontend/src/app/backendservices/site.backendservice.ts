import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Site } from '../models/site';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DigiResult } from "../models/digiresult";

@Injectable()
export class SiteBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'sites/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) { }

    /**
     * Ajouter un site
     * @param site 
     * @return : {Observable}
     */
    addSite(site: Site): Observable<DigiResult<Site>> {
        let stringifyItem = JSON.stringify(site);
        return this._httpClient.post<DigiResult<Site>>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un site
     * @param site 
     */
    partialUpdateSite(site: object): Observable<DigiResult<Site>> {
        let stringifyItem = JSON.stringify(site);
        return this._httpClient.patch<DigiResult<Site>>(this._apiname + site['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les sites
    * @returns : Observable<Site[]>
    */
    getSites(): Observable<DigiResult<Site[]>> {
        return this._httpClient.get<DigiResult<Site[]>>(this._apiname);
    }

    /**
    * Obtenir les sites non archivés
    * @returns : Observable<Site[]>
    */
    getAvailablesSites(): Observable<DigiResult<Site[]>> {
        return this._httpClient.get<DigiResult<Site[]>>(this._apiname + 'availables');
    }


    /**
     * Obtenir un site
     * @param idSite 
     */
    getSite(idSite): Observable<DigiResult<Site>> {
        return this._httpClient.get<DigiResult<Site>>(this._apiname + idSite);
    }

    /**
     * Suppression d'un site par son id
     * @param idSite 
     * @returns 
     */
    deleteSite(idSite): Observable<DigiResult<boolean>> {
        return this._httpClient.delete<DigiResult<boolean>>(this._apiname + idSite, this._httpOptions);
    }
}
