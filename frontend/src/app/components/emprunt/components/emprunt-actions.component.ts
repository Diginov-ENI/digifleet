import { Component, OnInit, Input } from '@angular/core';
import { Emprunt } from 'src/app/models/emprunt';
import { Utilisateur } from 'src/app/models/utilisateur';

@Component({
    selector: 'emprunt-actions',
    templateUrl: 'emprunt-actions.component.html'
  })

  export class EmpruntActions implements OnInit {
    @Input() connectedUser!: Utilisateur;
    @Input() emprunt!: Emprunt;
    @Input() listeStatut;
    @Input() openConfirmDeleteDialog: (emprunt: Emprunt) => void;
    @Input() openConfirmCancelDialog: (emprunt: Emprunt) => void;
    @Input() openSelectVehiculeDialog: (emprunt: Emprunt) => void;
    @Input() updateEmprunt: (emprunt: Emprunt) => void;
  
    constructor() {}
  
    ngOnInit() {
    }

    updateStatut(newStatut){
      let emprunt = new Emprunt()
      emprunt.Id = this.emprunt.Id
      emprunt.Statut = newStatut
      this.updateEmprunt(emprunt);
    }
  }