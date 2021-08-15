import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Vehicule } from '../models/vehicule';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DigiResult } from "../models/digiresult";

@Injectable()
export class VehiculeBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'vehicules/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) {}

    /**
     * Ajouter un vehicule
     * @param vehicule 
     * @return : {Observable}
     */
    addVehicule(vehicule: Vehicule): Observable<DigiResult<Vehicule>> {
        let stringifyItem = JSON.stringify(vehicule);
        return this._httpClient.post<DigiResult<Vehicule>>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un vehicule
     * @param vehicule 
     */
    updateVehicule(vehicule: object): Observable<DigiResult<Vehicule>> {
        let stringifyItem = JSON.stringify(vehicule);
        return this._httpClient.patch<DigiResult<Vehicule>>(this._apiname + vehicule['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les vehicules
    * @returns : Observable<Vehicule[]>
    */
    getVehicules(): Observable<DigiResult<Vehicule[]>> {
        return this._httpClient.get<DigiResult<Vehicule[]>>(this._apiname);
    }

    /**
    * Obtenir les vehicules avec des filtres
    * @returns : Observable<Vehicule[]>
    */
    getAvailableVehicules(site, dateDebut, dateFin?): Observable<DigiResult<Vehicule[]>> {
        let params = new HttpParams()
            .set('siteId', site.Id)
            .set('dateDebut', dateDebut);

        if(dateFin){
            params.set('dateFin', dateFin);
        }
        
        return this._httpClient.get<DigiResult<Vehicule[]>>(this._apiname + 'availables', {params: params});
    }

    /**
     * Obtenir un vehicule
     * @param id 
     */
    getVehicule(id): Observable<DigiResult<Vehicule>> {
        return this._httpClient.get<DigiResult<Vehicule>>(this._apiname + id);
    }
    
    /**
     * Suppression d'un vehicule par son id
     * 
     * @param idVehicule 
     * @returns 
     */
    deleteVehicule(idVehicule): Observable<DigiResult<boolean>> {
        return this._httpClient.delete<DigiResult<boolean>>(this._apiname + idVehicule, this._httpOptions);
    }
}
