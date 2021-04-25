import { NodeWithI18n } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import { Observable } from 'rxjs';

@Component({
  selector: 'utilisateur-list',
  templateUrl: 'utilisateur-list.component.html',
})

export class UtilisateurListComponent implements OnInit{
  utilisateurs: Utilisateur[];
  utilisateur: Utilisateur;
  tableColumns = ['nomPrenom', 'email', 'username', 'actions'];

  
  constructor(private _utilisateurBackendService: UtilisateurBackendService) {}

  ngOnInit(){
    this.getUtilisateurs();
    //this.getUtilisateurById(id);
    //this.deleteUtilisateur(id);
  }

  getUtilisateurs() {
      this._utilisateurBackendService.getUtilisateurs().subscribe((response => {
          this.utilisateurs = response;
      }))
  }

  getUtilisateurById(id){
    this._utilisateurBackendService.getUtilisateurById(id).subscribe((response => {
      this.utilisateur = response;
  }))
  }

  deleteUtilisateur(id){
    this._utilisateurBackendService.deleteUtilisateur(id).subscribe(() => {
      console.log("deleted");
  })
  }
}