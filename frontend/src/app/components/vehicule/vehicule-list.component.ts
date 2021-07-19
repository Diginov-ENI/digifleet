import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { Vehicule } from 'src/app/models/Vehicule';
import { Utilisateur } from 'src/app/models/utilisateur';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'vehicule-list',
  templateUrl: 'vehicule-list.component.html',
  styleUrls : ['vehicule-list.scss'],
})

export class VehiculeListComponent implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private connectedUser: Utilisateur = null;
  vehicules: Vehicule[];
  vehicule: Vehicule;
  dataSource = new MatTableDataSource();
  tableColumns: string[] = ['immatriculation', 'modele', 'marque', 'couleur', 'nbPlace', 'site', 'etat', 'actions'];

  nbColumnsAffiche = 7;

  constructor(
    private _vehiculeBackendService: VehiculeBackendService, 
    public matDialog: MatDialog, 
    private authService: AuthService,
  ) {}

  ngOnInit(){
    this.authService.getUser().subscribe(user => this.connectedUser = user);
    this.getVehicules();
    this.onResize();
  }

  getVehicules() {
    this._vehiculeBackendService.getVehicules().subscribe((response => {
        this.vehicules = response;
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
    }))
  }

  getVehiculeById(id){
    this._vehiculeBackendService.getVehicule(id).subscribe((response => {
      this.vehicule = response;
    }))
  }

  deleteVehicule(id){
    this._vehiculeBackendService.deleteVehicule(id).subscribe(() => {
      this.getVehicules();
    })
  }

  archiverDesarchiverVehicule(vehicule: Vehicule){
      let object:object = {
        'Id' : vehicule.Id,
        'IsActive' : !vehicule.IsActive
      };

      this._vehiculeBackendService.updateVehicule(object).subscribe(res => {
        this.getVehicules();
      });
  }

  openConfirmDeleteDialog(vehicule: Vehicule) {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation suppression',
        libConfirmation: `Souhaitez vous supprimer ce véhicule ?`,
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
        titre: 'Confirmation archivage',
        libConfirmation: `Souhaitez vous archiver ce véhicule ?`,
        libBouton: vehicule.IsActive ? 'Archiver' : 'Désarchiver'
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
