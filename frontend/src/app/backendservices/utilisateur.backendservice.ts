import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { UtilisateurFormComponent } from '../components/utilisateur/utilisateur-form.component';
import { Utilisateur } from '../models/utilisateur';

@Injectable()
export class UtilisateurBackendService {
    private readonly _apiname = 'Utilisateur';
    
    constructor() {
    }

    // Ajout d'un utilisateur
    // @params {Objet} utilisateur : l'utilisateur
    // @return : {Observable}
    addUtilisateur(utilisateur: Utilisateur) { //: Observable<Utilisateur>{
        JSON.stringify(utilisateur); // ToDo
    }

}