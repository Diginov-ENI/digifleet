import { Component, OnInit } from '@angular/core';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Utilisateur } from 'src/app/models/utilisateur';

@Component({
  selector: 'emprunt-list',
  templateUrl: 'emprunt-list.component.html',
  styleUrls: ['emprunt-list.scss'],
})

export class EmpruntListComponent implements OnInit {
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

  getEmprunts() {
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

  deleteEmprunt(id) {
    this._empruntBackendService.deleteEmprunt(id).subscribe(() => {
      this.getEmprunts();
    })
  }
}

export interface DialogData {
  emprunt: Emprunt;
}
