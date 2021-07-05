import { Component, OnInit, Input } from '@angular/core';
import { Emprunt } from 'src/app/models/emprunt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utilisateur } from 'src/app/models/utilisateur';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';

@Component({
    selector: 'emprunt-actions',
    templateUrl: 'emprunt-actions.component.html'
  })

  export class EmpruntActions implements OnInit {
    @Input() connectedUser!: Utilisateur;
    @Input() emprunt!: Emprunt;
    @Input() listeStatut;
    @Input() openConfirmDeleteDialog: (emprunt: Emprunt) => void;
    step: number;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
  
    constructor(private _empruntBackendService: EmpruntBackendService) {}
  
    ngOnInit() {
    }

    updateStatut(newStatut){
      let emprunt = new Emprunt()
      emprunt.Id = this.emprunt.Id
      emprunt.Statut = newStatut
      this._empruntBackendService.partialUpdateEmprunt(emprunt).subscribe((response => {
        this.emprunt = response;
      }))
    }
  }