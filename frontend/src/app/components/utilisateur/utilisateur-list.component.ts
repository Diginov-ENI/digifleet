import { Component, OnInit, HostListener, ViewChild, Inject } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'utilisateur-list',
  templateUrl: 'utilisateur-list.component.html',
  styleUrls: ['utilisateur-list.scss'],
})

export class UtilisateurListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private connectedUser:Utilisateur = null;
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
    this.authService.getUser().subscribe(user=>this.connectedUser = user);
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
    const dialogRef = this.matDialog.open(ConfirmDeleteUtilisateurDialogComponent, {
      data: {
        utilisateur: utilisateur
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUtilisateur(utilisateur.Id);
      }
    });
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

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: './dialogs/confirm-delete-dialog.component.html',
})
export class ConfirmDeleteUtilisateurDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteUtilisateurDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

export interface DialogData {
  utilisateur: Utilisateur;
}
