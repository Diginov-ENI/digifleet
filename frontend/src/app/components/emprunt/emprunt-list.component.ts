import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { Utilisateur } from 'src/app/models/utilisateur';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';

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
  currentStep: number;
  listeStatut: { [key: string]: string} = {
    'DEPOSEE': 'demande déposée',
    'REFUSEE': 'demande refusée',
    'ANNULEE': 'demande annulée',
    'ATTENTE_CLEF': 'clef à récupérer',
    'EN_COURS': 'emprunt en cours',
    'CLOTUREE': 'demande cloturée',
  };
  format: string = 'dd-MM-yyyy';

  constructor(private _empruntBackendService: EmpruntBackendService, public matDialog: MatDialog, private authService: AuthService) { }

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
}

export interface DialogData {
  emprunt: Emprunt;
}
