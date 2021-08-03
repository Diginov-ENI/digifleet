import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { Utilisateur } from 'src/app/models/utilisateur';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { Vehicule } from 'src/app/models/vehicule';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";


import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators, ReactiveFormsModule  } from '@angular/forms';

@Component({
  selector: 'emprunt-list',
  templateUrl: 'emprunt-list.component.html',
  styleUrls: ['emprunt-list.scss'],
})

export class EmpruntListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private connectedUser: Utilisateur = null;
  emprunts: Emprunt[];
  emprunt: Emprunt;
  availableVehicules: Vehicule[];
  listeStatut: { [key: string]: string} = {
    'DEPOSEE': 'demande déposée',
    'REFUSEE': 'demande refusée',
    'ANNULEE': 'demande annulée',
    'ATTENTE_CLEF': 'clef à récupérer',
    'EN_COURS': 'emprunt en cours',
    'CLOTUREE': 'demande cloturée',
  };
  format: string = 'dd-MM-yyyy';

  constructor(private _empruntBackendService: EmpruntBackendService, private _vehiculeBackendService: VehiculeBackendService, public matDialog: MatDialog, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => this.connectedUser = user);
    if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
      this.getEmprunts();
    }else{
      this.getEmpruntsByOwner(this.connectedUser.Id);
    }
  }

  getEmprunts = (): void => {
    this._empruntBackendService.getEmprunts().subscribe((response => {
      this.emprunts = response;
    }))
  }

  getEmpruntsByOwner(idOwner) {
    this._empruntBackendService.getEmpruntsByOwner(idOwner).subscribe((response => {
      this.emprunts = response;
    }))
  }

  getEmpruntById(id) {
    this._empruntBackendService.getEmprunt(id).subscribe((response => {
      this.emprunt = response;
    }))
  }

  updateEmprunt = (emprunt: Emprunt): void => {
    this._empruntBackendService.partialUpdateEmprunt(emprunt).subscribe(() => {
      if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
        this.getEmprunts();
      }else{
        this.getEmpruntsByOwner(this.connectedUser.Id);
      }
    })
  }

  deleteEmprunt(id) {
    this._empruntBackendService.deleteEmprunt(id).subscribe(() => {
      if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
        this.getEmprunts();
      }else{
        this.getEmpruntsByOwner(this.connectedUser.Id);
      }
    })
  }

  openConfirmDeleteDialog = (emprunt: Emprunt): void => {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation suppression',
        libConfirmation: `Souhaitez vous supprimer cet emprunt ?`,
        libBouton: 'Supprimer'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEmprunt(emprunt.Id);
      }
    });
  }

  openConfirmCancelDialog = (emprunt: Emprunt): void => {
    const dialogRef = this.matDialog.open(DialogConfirmComponent, {
      data: {
        titre: 'Confirmation annulation',
        libConfirmation: `Souhaitez vous annuler cet emprunt ?`,
        libBouton: 'Confirmer'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let empruntToUpdate = new Emprunt()
        empruntToUpdate.Id = emprunt.Id
        empruntToUpdate.Statut = 'ANNULEE'
        this.updateEmprunt(empruntToUpdate);
      }
    });
  }

  openSelectVehiculeDialog = (emprunt: Emprunt): void => {
    // fetch vehicules (available on this timeline + same site)
    this._vehiculeBackendService.getAvailableVehiculesForEmprunt(emprunt.Site, emprunt.DateDebut, emprunt.DateFin).subscribe((response => {
      this.availableVehicules = response;

      // Open dialog with input select vehicule
      const dialogRef = this.matDialog.open(DialogSelectVehicule, {
        width: '250px',
        data: {
          availableVehicules: this.availableVehicules,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        // TODO : update emprunt with result
        if(result){
          let vehicule: Vehicule = {'Id': result, 'Immatriculation': undefined, 'Modele': undefined, 'Marque': undefined, 'Couleur': undefined, 'NbPlace': undefined, 'IsActive': undefined, 'Site': undefined};
          let object: object = {
            'Id' : emprunt.Id,
            'Statut' : 'ATTENTE_CLEF',
            'Vehicule' : vehicule,
          }
          this._empruntBackendService.partialUpdateEmprunt(object).subscribe(() => {
            if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
              this.getEmprunts();
            }else{
              this.getEmpruntsByOwner(this.connectedUser.Id);
            }
          })
        }
      });
    }))
  }
}

@Component({
  selector: 'select-vehicule-dialog',
  templateUrl: './components/select-vehicule-dialog.html',
})
export class DialogSelectVehicule {
  constructor(
    public dialogRef: MatDialogRef<DialogSelectVehicule>,
    @Inject(MAT_DIALOG_DATA) public data: { availableVehicules: Vehicule[] }) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


