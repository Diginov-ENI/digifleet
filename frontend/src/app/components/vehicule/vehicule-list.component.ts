import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { Vehicule } from 'src/app/models/vehicule';
import { Utilisateur } from 'src/app/models/utilisateur';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';


@Component({
  selector: 'vehicule-list',
  templateUrl: 'vehicule-list.component.html',
  styleUrls : ['vehicule-list.scss'],
})

export class VehiculeListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public connectedUser: Utilisateur;
  vehicules: Vehicule[];
  vehicule: Vehicule;
  dataSource = new MatTableDataSource();
  tableColumns: string[] = ['immatriculation', 'modele', 'marque', 'couleur', 'nbPlace', 'etat', 'actions'];

  nbColumnsAffiche = 6;

  constructor(
    private _vehiculeBackendService: VehiculeBackendService, 
    public matDialog: MatDialog, 
    private authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(){
    this.authService.getUser().subscribe(user => this.connectedUser = user);
    this.getVehicules();
    this.onResize();
  }

  getVehicules() {
    this._vehiculeBackendService.getVehicules().subscribe((response => {
      if(response.IsSuccess){
        this.vehicules = response.Data;
        this.dataSource = new MatTableDataSource(response.Data);
        this.dataSource.paginator = this.paginator;
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    }))
  }

  deleteVehicule(id) {
    this._vehiculeBackendService.deleteVehicule(id).subscribe(res => {
      if(res.IsSuccess) {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Véhicule supprimé avec succès.'));
        this.getVehicules();
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }
    });
  }

  archiverDesarchiverVehicule(vehicule: Vehicule){
      let object:object = {
        'Id' : vehicule.Id,
        'IsActive' : !vehicule.IsActive
      };

    this._vehiculeBackendService.updateVehicule(object).subscribe(res => {
      if (res.IsSuccess) {
        this.getVehicules();
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(
          false, res.Data.IsActive ? 'Véhicule activé avec succès.' : 'Véhicule archivé avec succès.'));
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }
    });
  }

  openConfirmDeleteDialog(vehicule: Vehicule) {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation suppression',
        libConfirmation: `Souhaitez-vous supprimer le véhicule immatriculé "${vehicule.Immatriculation}" ?`,
        libBouton: 'Supprimer'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteVehicule(vehicule.Id);
      }
    });
  }

    openConfirmArchiveDialog(vehicule: Vehicule) {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: vehicule.IsActive ? 'Archiver un véhicule' : 'Activer un véhicule',
        libConfirmation: vehicule.IsActive ? `Souhaitez-vous archiver le véhicule immatriculé "${vehicule.Immatriculation}" ?`
          : `Souhaitez-vous activer le véhicule immatriculé "${vehicule.Immatriculation}" ?`,
        libBouton: vehicule.IsActive ? 'Archiver' : 'Activer'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.archiverDesarchiverVehicule(vehicule);
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
