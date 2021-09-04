import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GroupeBackendService } from 'src/app/backendservices/groupe.backendservice';
import { Groupe } from 'src/app/models/groupe';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteGroupeDialogComponent } from './dialogs/confirm-delete-groupe-dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'groupe-list',
  templateUrl: 'groupe-list.component.html',
  styleUrls: ['groupe-list.component.scss'],
})

export class GroupeListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _destroy$ = new Subject<void>();

  groupes: Groupe[];
  groupe: Groupe;
  dataSource = new MatTableDataSource();
  tableColumns: string[] = ['name', 'actions'];
  connectedUser = null;
  nbColumnsAffiche = 2;

  constructor(
    private _groupeBackendService: GroupeBackendService,
    public matDialog: MatDialog,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this._authService.utilisateurConnecte$
      .pipe(takeUntil(this._destroy$), filter(user => (user !== null && user !== undefined)))
      .subscribe(utilisateur => this.connectedUser = utilisateur);

    this.getGroupes();
  }


  ngOnDestroy() {
    this._destroy$.next();
  }

  getGroupes() {
    this._groupeBackendService.getGroupes().subscribe((response => {
      if (response.IsSuccess) {
        this.groupes = response.Data;
        this.dataSource = new MatTableDataSource(response.Data);
        this.dataSource.paginator = this.paginator;
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    }))
  }

  deleteGroupe(id) {
    this._groupeBackendService.deleteGroupe(id).subscribe(res => {
      if (res.IsSuccess) {
        this.getGroupes();
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Groupe supprimé avec succès.'));
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }

    })
  }

  openConfirmDeleteDialog(groupe: Groupe) {
    const dialogRef = this.matDialog.open(ConfirmDeleteGroupeDialogComponent, {
      data: {
        groupe: groupe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteGroupe(groupe.Id);
      }
    });
  }
}
