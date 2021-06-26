import { Component, OnInit, HostListener, ViewChild, Inject } from '@angular/core';
import { NodeWithI18n } from '@angular/compiler';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { Vehicule } from 'src/app/models/Vehicule';
import {MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { Router} from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'vehicule-list',
  templateUrl: 'vehicule-list.component.html',
  styleUrls : ['vehicule-list.scss'],
})

export class VehiculeListComponent implements OnInit{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  vehicules: Vehicule[];
  vehicule: Vehicule;
  dataSource = new MatTableDataSource();
  tableColumns = ['immatriculation', 'modele', 'marque', 'couleur', 'nb_place', 'etat', 'actions'];

  nbColumnsAffiche = 6;

  constructor(private _vehiculeBackendService: VehiculeBackendService, public matDialog: MatDialog,private authService: AuthService,private router: Router,) {}

  ngOnInit(){
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

  archiveVehicule(id){
    this._vehiculeBackendService.getVehicule(id).subscribe((response => {
      this.vehicule = response;
      let object:object = {
        'id' : id,
        'is_active' : !this.vehicule.is_active
      }
      this._vehiculeBackendService.updateVehicule(object).subscribe(res => {
        this.getVehicules();
        this.router.navigate(['Digifleet/liste-vehicule']);
      });
    }));
  }

  openConfirmDeleteDialog(id){
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponentVehicule);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteVehicule(id);
      }
    });
  }

  openConfirmArchiveDialog(id){
    const dialogRef = this.matDialog.open(ConfirmArchiveDialogComponentVehicule);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.archiveVehicule(id);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  private onResize(event?) {
    /*if (window.innerWidth < 420) {
      this.nbColumnsAffiche = 3;

    } else if (window.innerWidth < 520) {
      this.nbColumnsAffiche = 4;

    } else if (window.innerWidth < 800) {
      this.nbColumnsAffiche = 5;
    } else {
      this.nbColumnsAffiche = 6;
    }*/
  }


}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: './dialogs/confirm-delete-dialogVehicule.component.html',
  styleUrls : ['vehicule-list.scss'],
})


export class ConfirmDeleteDialogComponentVehicule {

}

@Component({
  selector: 'confirm-archive-dialog',
  templateUrl: './dialogs/confirm-archive-dialogVehicule.component.html',
  styleUrls : ['vehicule-list.scss'],
})
export class ConfirmArchiveDialogComponentVehicule {

}
