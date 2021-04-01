import { Component, OnInit } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';

@Component({
  selector: 'utilisateur-form',
  templateUrl: 'utilisateur-form.component.html',
})

export class UtilisateurFormComponent implements OnInit{
  utilisateur: Utilisateur;
  
  constructor(private _utilisateurBackendService: UtilisateurBackendService) {}

  ngOnInit(){
    // this.utilisateur = this._utilisateurBackendService.getUtilisateur().pipe(takeUntil(this._destroy$))
      // .subscribe(result => {
      //   if (result.IsSuccess) {
      //     this.nomClient = result.Data;
      //   } else {
      //     this._errorService.throwError(result, 'Echec de récupération du client');
      //   }
      // });
  }
}
