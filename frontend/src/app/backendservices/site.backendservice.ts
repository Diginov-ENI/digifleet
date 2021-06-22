import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { SiteListComponent } from '../components/site/site-list.component';
import { Site } from '../models/site';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class SiteBackendService {
    private readonly _apiroute = 'http://localhost:8000/api/';
    private readonly _apiname = this._apiroute + 'sites/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) {}

    /**
     * Ajouter un site
     * @param site 
     * @return : {Observable}
     */
    addSite(site: Site): Observable<Site> {
        let stringifyItem = JSON.stringify(site);
        return this._httpClient.post<Site>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un site
     * @param site 
     */
    updateSite(site: object): Observable<Site> {
        let stringifyItem = JSON.stringify(site);
        return this._httpClient.put<Site>(this._apiname + site['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les site
    * @returns : Observable<Site[]>
    */
    getSites(): Observable<Site[]> {
        return this._httpClient.get<Site[]>(this._apiname);
    }

    /**
     * Obtenir un site
     * @param idSite 
     */
    getSite(idSite): Observable<Site> {
        return this._httpClient.get<Site>(this._apiname + idSite);
    }
    
    /**
     * Suppression d'un site par son id
     * 
     * @param idSite 
     * @returns 
     */
    deleteSite(idSite) {
        return this._httpClient.delete(this._apiname + idSite, this._httpOptions);
    }
}
