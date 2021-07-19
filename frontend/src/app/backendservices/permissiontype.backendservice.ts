import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PermissionType } from "../models/permission_type";

@Injectable()
export class PermissionTypeBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'permission-types/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) {}

    /**
    * Obtenir les types de permission
    * @returns : Observable<Groupe[]>
    */
    getPermissionTypes(): Observable<PermissionType[]> {
        return this._httpClient.get<PermissionType[]>(this._apiname);
    }

    /**
     * Obtenir un groupe
     * @param idGroupe 
     */
     getPermissionType(idPermissionType): Observable<PermissionType> {
        return this._httpClient.get<PermissionType>(this._apiname + idPermissionType);
    }
    
    
}
