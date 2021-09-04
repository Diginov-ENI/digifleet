import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Groupe } from '../models/groupe';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DigiResult } from "../models/digiresult";
import { Notification } from '../models/notification';

@Injectable()
export class NotificationBackendService {
    private readonly _apiroute = environment.API_URL;
    private readonly _apiname = this._apiroute + 'notifications/';
    private readonly _httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(private _httpClient: HttpClient) { }

   

    /**
     * Modifier une Notification
     * @param id 
     */
    setReadNotification(id: number): Observable<DigiResult<Notification>> {
        let stringifyItem = JSON.stringify({Id:id,IsRead:true});
        return this._httpClient.put<DigiResult<Notification>>(this._apiname + id + '/', stringifyItem, this._httpOptions);
    }

    /**
    * Obtenir les Notifications
    * @returns : Observable<Notification[]>
    */
    getNotifications(): Observable<DigiResult<Notification[]>> {
        return this._httpClient.get<DigiResult<Notification[]>>(this._apiname);
    }

}
