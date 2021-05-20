import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { VehiculeListComponent } from '../components/vehicule/vehicule-list.component';
import { Vehicule } from '../models/Vehicule';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class VehiculeBackendService {
    private readonly _apiroute = 'http://localhost:8000/api/';
    private readonly _apiname = this._apiroute + 'Vehicules/';
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
    addVehicule(vehicule: Vehicule): Observable<Vehicule> {

        let stringifyItem = JSON.stringify(vehicule);
        return this._httpClient.post<Vehicule>(this._apiname, stringifyItem, this._httpOptions);
    }

    /**
     * Modifier un vehicule
     * @param vehicule 
     */
    updateVehicule(vehicule: object): Observable<Vehicule> {
        let stringifyItem = JSON.stringify(vehicule);



        return this._httpClient.patch<Vehicule>(this._apiname + Vehicule['Id'] + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les vehicules
    * @returns : Observable<Utilisateur[]>
    */
    getVehicules(): Observable<Vehicule[]> {
        return this._httpClient.get<Vehicule[]>(this._apiname);
    }

    /**
     * Obtenir un utilisateur
     * @param id 
     */
    getVehicule(id): Observable<Vehicule> {
        return this._httpClient.get<Vehicule>(this._apiname + id);
    }
    
    /**
     * Suppression d'un utilisateur par son id
     * 
     * @param idVehicule
     * @returns 
     */
    deleteVehicule(idVehicule) {
        return this._httpClient.delete(this._apiname + idVehicule, this._httpOptions);
    }
}
