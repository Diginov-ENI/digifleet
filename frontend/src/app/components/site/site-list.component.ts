import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { Site } from 'src/app/models/site';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'site-list',
  templateUrl: 'site-list.component.html',
  styleUrls: ['site-list.scss'],
})

export class SiteListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  sites: Site[];
  site: Site;
  dataSource = new MatTableDataSource();
  tableColumns: string[] = ['libelle', 'actions'];

  nbColumnsAffiche = 2;

  constructor(
    private _siteBackendService: SiteBackendService,
    public matDialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getSites();
  }

  getSites() {
    this._siteBackendService.getSites().subscribe(response => {
      if (response.IsSuccess) {
        this.sites = response.Data;
        this.dataSource = new MatTableDataSource(response.Data);
        this.dataSource.paginator = this.paginator;
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    });
  }

  deleteSite(id) {
    this._siteBackendService.deleteSite(id).subscribe(res => {
      if(res.IsSuccess) {
        this.getSites();
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Site supprimé avec succès.'));
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }
    })
  }

  openConfirmDeleteDialog(site: Site) {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation suppression',
        libConfirmation: `Souhaitez-vous supprimer le site "${site?.Libelle}" ?`,
        libBouton: 'Supprimer'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteSite(site.Id);
      }
    });
  }
}
