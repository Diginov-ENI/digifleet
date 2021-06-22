import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { identifierModuleUrl } from '@angular/compiler';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'utilisateur-list',
  templateUrl: 'utilisateur-list.component.html',
  styleUrls: ['utilisateur-list.scss'],
})

export class UtilisateurListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private connectedUser: Utilisateur = null;
  utilisateurs: Utilisateur[];
  utilisateur: Utilisateur;
  dataSource = new MatTableDataSource();
  tableColumns: string[] = ['nom', 'prenom', 'nomPrenom', 'email', 'username', 'etat', 'actions'];

  nbColumnsAffiche = 6;

  constructor(
    private _utilisateurBackendService: UtilisateurBackendService,
    public matDialog: MatDialog,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.connectedUser = user);
    this.getUtilisateurs();
    this.onResize();
  }

  getUtilisateurs() {
    this._utilisateurBackendService.getUtilisateurs().subscribe((response => {
      this.utilisateurs = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    }))
  }

  getUtilisateurById(id) {
    this._utilisateurBackendService.getUtilisateur(id).subscribe((response => {
      this.utilisateur = response;
    }))
  }

  deleteUtilisateur(id) {
    this._utilisateurBackendService.deleteUtilisateur(id).subscribe(() => {
      this.getUtilisateurs();
    })
  }

  openConfirmDeleteDialog(utilisateur: Utilisateur) {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation suppression',
        libConfirmation: `Souhaitez vous supprimer l'utilisateur "${utilisateur?.Nom} ${utilisateur?.Prenom}" ?`,
        libBouton: 'Supprimer'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUtilisateur(utilisateur.Id);
      }
    });
  }

  ActiverDesactiverCompte(utilisateur: Utilisateur) {

    let object: object = {
      'Id': utilisateur.Id,
      'IsActive': !utilisateur.IsActive
    };

    if (!utilisateur?.IsActive) {
      this._utilisateurBackendService.updateUtilisateur(object).subscribe(() => {
        this.getUtilisateurs();
      });
    } else {
      const dialogRef = this.matDialog.open(DialogConfirmComponent, {
        data: {
          titre: 'Désactiver un compte utilisateur',
          libConfirmation: `Souhaitez-vous désactiver l'utilisateur "${utilisateur?.Nom} ${utilisateur?.Prenom}" ?`,
          libBouton: 'Désactiver'
        }
      });

      dialogRef.afterClosed().subscribe(hasConfirmation => {
        if (hasConfirmation) {
          this._utilisateurBackendService.updateUtilisateur(object).subscribe(() => {
            this.getUtilisateurs();
          });
        }
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event?) {
    if (window.innerWidth < 420) {
      this.nbColumnsAffiche = 3;

    } else if (window.innerWidth < 520) {
      this.nbColumnsAffiche = 4;

    } else if (window.innerWidth < 800) {
      this.nbColumnsAffiche = 5;
    } else {
      this.nbColumnsAffiche = 6;
    }
  }
}
