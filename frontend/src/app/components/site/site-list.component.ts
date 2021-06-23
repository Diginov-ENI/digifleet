import { Component, OnInit, HostListener, ViewChild, Inject } from '@angular/core';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { Site } from 'src/app/models/site';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

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

  constructor(private _siteBackendService: SiteBackendService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.getSites();
  }

  getSites() {
    this._siteBackendService.getSites().subscribe((response => {
      this.sites = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    }))
  }

  getSiteById(id) {
    this._siteBackendService.getSite(id).subscribe((response => {
      this.site = response;
    }))
  }

  deleteSite(id) {
    this._siteBackendService.deleteSite(id).subscribe(() => {
      this.getSites();
    })
  }

  openConfirmDeleteDialog(site: Site) {

    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation suppression',
        libConfirmation: `Souhaitez vous supprimer le site "${site?.Libelle}" ?`,
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
