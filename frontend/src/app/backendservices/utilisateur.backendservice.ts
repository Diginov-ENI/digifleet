import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { HttpClient } from '@angular/common/http'; // , HttpErrorResponse

// import { catchError } from 'rxjs/operators';
// import { GlobalsConstantsService } from '../services/globalsconstants.service';
// import { AuthBackendService } from './auth.backendservice';

@Injectable()
export class UtilisateurBackendService {
    private readonly _apiname = 'utilisateurs';

    constructor(
        private _httpClient: HttpClient
    ) {
    }

    // Ajout d'un utilisateur
    // @params {Objet} utilisateur : l'utilisateur
    // @return : {Observable}
    addUtilisateur(utilisateur: Utilisateur): Observable<Utilisateur> {

        let stringifyItem = JSON.stringify(utilisateur);

        const header = new Headers();
        header.append('Content-Type', 'application/json');

        return this._httpClient.post<Utilisateur>('http://losthost:8000/api/' + this._apiname, stringifyItem);
    }

    /**
    * Récupération de la liste des utilisateurs
    * 
    * @returns : Observable<Utilisateur[]>
    */
    getUtilisateurs(): Observable<Utilisateur[]> {
        return this._httpClient.get<Utilisateur[]>('http://localhost:8000/api/utilisateurs');
    }

    getUtilisateur(id): Observable<Utilisateur> {
        return this._httpClient.get<Utilisateur>('http://localhost:8000/api/utilisateurs/' + id);
    }

    // En cours
    // postApi(apiName: string, body: any, options?: any): Observable<any> {
    // 	return this._httpClient.post(this._globalsConstants.apiUrl + apiName, body, this._authService.getOptions(options))
    // 		.pipe(catchError((err, caught) => AuthBackendService.handleError(err, caught)));
    // }
}