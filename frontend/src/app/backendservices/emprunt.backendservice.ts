import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { EmpruntListComponent } from '../components/emprunt/emprunt-list.component';
import { Emprunt } from '../models/emprunt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    addEmprunt(emprunt: Emprunt): Observable<Emprunt> {
        let stringifyItem = JSON.stringify(emprunt);
        return this._httpClient.post<Emprunt>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un emprunt
     * @param emprunt 
     */
    updateEmprunt(emprunt: object): Observable<Emprunt> {
        let stringifyItem = JSON.stringify(emprunt);
        return this._httpClient.put<Emprunt>(this._apiname + emprunt['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les emprunt
    * @returns : Observable<Emprunt[]>
    */
    getEmprunts(): Observable<Emprunt[]> {
        return this._httpClient.get<Emprunt[]>(this._apiname);
    }

    /**
     * Obtenir un emprunt
     * @param idEmprunt 
     */
    getEmprunt(idEmprunt): Observable<Emprunt> {
        return this._httpClient.get<Emprunt>(this._apiname + idEmprunt);
    }
    
    /**
     * Suppression d'un emprunt par son id
     * 
     * @param idEmprunt 
     * @returns 
     */
    deleteEmprunt(idEmprunt) {
        return this._httpClient.delete(this._apiname + idEmprunt, this._httpOptions);
    }
}
