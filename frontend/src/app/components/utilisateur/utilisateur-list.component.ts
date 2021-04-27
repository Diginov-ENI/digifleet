import { NodeWithI18n } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import {MatDialog} from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'utilisateur-list',
  templateUrl: 'utilisateur-list.component.html',
  styleUrls : ['utilisateur-list.scss'],
})

export class UtilisateurListComponent implements OnInit{
  utilisateurs: Utilisateur[];
  utilisateur: Utilisateur;
  tableColumns = ['nomPrenom', 'email', 'username', 'actions'];

  constructor(private _utilisateurBackendService: UtilisateurBackendService, public matDialog: MatDialog) {}

  ngOnInit(){
    this.getUtilisateurs();
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
      this.getUtilisateurs();
    })
  }

  openConfirmDeleteDialog(id){
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteUtilisateur(id);
      }
    });
  }
}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: './dialogs/confirm-delete-dialog.component.html',
  styleUrls : ['utilisateur-list.scss'],
})
export class ConfirmDeleteDialogComponent {

}