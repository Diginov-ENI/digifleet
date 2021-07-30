import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'utilisateur-list',
  templateUrl: 'utilisateur-list.component.html',
  styleUrls: ['utilisateur-list.scss'],
})

export class UtilisateurListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public connectedUser: Utilisateur = null;
  utilisateurs: Utilisateur[];
  utilisateur: Utilisateur;
  dataSource = new MatTableDataSource();
  tableColumns: string[] = ['nom', 'prenom', 'nomPrenom', 'email', 'username', 'etat', 'actions'];

  nbColumnsAffiche = 6;

  constructor(
    private _utilisateurBackendService: UtilisateurBackendService,
    public matDialog: MatDialog,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.connectedUser = user);
    this.getUtilisateurs();
    this.onResize();
  }

  getUtilisateurs() {
    this._utilisateurBackendService.getUtilisateurs().subscribe((response => {
      if (response.IsSuccess) {
        this.utilisateurs = response.Data;
        this.dataSource = new MatTableDataSource(this.utilisateurs);
        this.dataSource.paginator = this.paginator;
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    }))
  }

  deleteUtilisateur(id) {
    this._utilisateurBackendService.deleteUtilisateur(id).subscribe((res => {
      if (res.IsSuccess) {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Utilisateur supprimé avec succès.'));
        this.getUtilisateurs();
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }
    }));
  }

  openConfirmDeleteDialog(utilisateur: Utilisateur) {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation suppression',
        libConfirmation: `Souhaitez-vous supprimer l'utilisateur "${utilisateur?.Nom} ${utilisateur?.Prenom}" ?`,
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
      this._utilisateurBackendService.updateUtilisateur(object).subscribe((res => {
        if (res.IsSuccess) {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Utilisateur activé avec succès.'));
          this.getUtilisateurs();
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      }));
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
          this._utilisateurBackendService.updateUtilisateur(object).subscribe((res => {
            if (res.IsSuccess) {
              this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Utilisateur désactivé avec succès.'));
              this.getUtilisateurs();
            } else {
              this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
            }
          }));
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
