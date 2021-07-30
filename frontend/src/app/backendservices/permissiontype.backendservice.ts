import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PermissionType } from "../models/permission_type";
import { DigiResult } from "../models/digiresult";

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
    * @returns : Observable<PermissionType[]>
    */
    getPermissionTypes(): Observable<DigiResult<PermissionType[]>> {
        return this._httpClient.get<DigiResult<PermissionType[]>>(this._apiname);
    }

    /**
     * Obtenir un groupe
     * @param idGroupe 
     */
     getPermissionType(idPermissionType): Observable<DigiResult<PermissionType>> {
        return this._httpClient.get<DigiResult<PermissionType>>(this._apiname + idPermissionType);
    }
}
