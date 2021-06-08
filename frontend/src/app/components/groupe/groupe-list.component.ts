import { Component, OnInit, HostListener, ViewChild, Inject } from '@angular/core';
import { GroupeBackendService } from 'src/app/backendservices/groupe.backendservice';
import { Groupe } from 'src/app/models/groupe';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteGroupeDialogComponent } from './dialogs/confirm-delete-groupe-dialog.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'groupe-list',
  templateUrl: 'groupe-list.component.html',
  styleUrls: ['groupe-list.component.scss'],
})

export class GroupeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  groupes: Groupe[];
  groupe: Groupe;
  dataSource = new MatTableDataSource();
  tableColumns: string[] = ['name', 'actions'];
  connectedUser = null;
  nbColumnsAffiche = 2;

  constructor(
    private _groupeBackendService: GroupeBackendService, 
    public matDialog: MatDialog,
    private authService: AuthService
    ) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user=>this.connectedUser = user);
    this.getGroupes();
  }

  getGroupes() {
    this._groupeBackendService.getGroupes().subscribe((response => {
      this.groupes = response;
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    }))
  }

  getGroupeById(id) {
    this._groupeBackendService.getGroupe(id).subscribe((response => {
      this.groupe = response;
    }))
  }

  deleteGroupe(id) {
    this._groupeBackendService.deleteGroupe(id).subscribe(() => {
      this.getGroupes();
    })
  }

  openConfirmDeleteDialog(groupe: Groupe) {
    console.log(groupe)
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

