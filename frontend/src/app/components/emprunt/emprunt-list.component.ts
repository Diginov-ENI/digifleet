import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { Utilisateur } from 'src/app/models/utilisateur';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { Vehicule } from 'src/app/models/vehicule';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

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

  constructor(
    private _empruntBackendService: EmpruntBackendService, 
    private _vehiculeBackendService: VehiculeBackendService, 
    public matDialog: MatDialog, private authService: AuthService,
    private _snackBar: MatSnackBar,
    ) { }

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
      if(response.IsSuccess){
        this.emprunts = response.Data;
      }else{
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    }))
  }

  getEmpruntsByOwner(idOwner) {
    this._empruntBackendService.getEmpruntsByOwner(idOwner).subscribe((response => {
      if(response.IsSuccess){
        this.emprunts = response.Data;
      }else{
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    }))
  }

  getEmpruntById(id) {
    this._empruntBackendService.getEmprunt(id).subscribe(response => {
      if(response.IsSuccess){
        this.emprunt = response.Data;
      }else{
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    })
  }
  
  updateEmpruntsList(emprunts: Emprunt[]){
    this.emprunts = emprunts;
  }

  updateEmprunt = (emprunt: Emprunt): void => {
    this._empruntBackendService.partialUpdateEmprunt(emprunt).subscribe(response => {
      if(response.IsSuccess){
        if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
          this.getEmprunts();
        }else{
          this.getEmpruntsByOwner(this.connectedUser.Id);
        }
      }else{
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    })
  }

  deleteEmprunt(id) {
    this._empruntBackendService.deleteEmprunt(id).subscribe(response => {
      if(response.IsSuccess){
        if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
          this.getEmprunts();
        }else{
          this.getEmpruntsByOwner(this.connectedUser.Id);
        }
      }else{
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
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
    this._vehiculeBackendService.getAvailableVehiculesForEmprunt(emprunt.Site, emprunt.DateDebut, emprunt.DateFin).subscribe(response => {
      this.availableVehicules = response.Data;

      // Open dialog with input select vehicule
      const dialogRef = this.matDialog.open(DialogSelectVehicule, {
        width: '250px',
        data: {
          availableVehicules: this.availableVehicules,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          let vehicule: Vehicule = {'Id': result, 'Immatriculation': undefined, 'Modele': undefined, 'Marque': undefined, 'Couleur': undefined, 'NbPlace': undefined, 'IsActive': undefined, 'Site': undefined};
          let object: object = {
            'Id' : emprunt.Id,
            'Statut' : 'ATTENTE_CLEF',
            'Vehicule' : vehicule,
          }
          this._empruntBackendService.partialUpdateEmprunt(object).subscribe(response => {
            if(response.IsSuccess){
              if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
                this.getEmprunts();
              }else{
                this.getEmpruntsByOwner(this.connectedUser.Id);
              }
            }else{
              this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
            }
          })
        }
      });
    })
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


