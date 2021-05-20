import { NodeWithI18n } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { Vehicule } from 'src/app/models/Vehicule';
import {MatDialog} from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'vehicule-list',
  templateUrl: 'vehicule-list.component.html',
  styleUrls : ['vehicule-list.scss'],
})

export class VehiculeListComponent implements OnInit{
  vehicules: Vehicule[];
  vehicule: Vehicule;
  tableColumns = ['immatriculation', 'modele', 'marque', 'couleur', 'nb_place', 'actions'];

  constructor(private _vehiculeBackendService: VehiculeBackendService, public matDialog: MatDialog) {}

  ngOnInit(){
    this.getVehicules();
  }

  getVehicules() {
    this._vehiculeBackendService.getVehicules().subscribe((response => {
        this.vehicules = response;
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

  openConfirmDeleteDialog(id){
    const dialogRef = this.matDialog.open(ConfirmDeleteDialogComponentVehicule);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteVehicule(id);
      }
    });
  }
}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: './dialogs/confirm-delete-dialogVehicule.component.html',
  styleUrls : ['vehicule-list.scss'],
})
export class ConfirmDeleteDialogComponentVehicule {

}
