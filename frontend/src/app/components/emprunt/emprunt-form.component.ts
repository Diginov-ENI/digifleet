import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { Emprunt } from 'src/app/models/emprunt';

@Component({
  selector: 'emprunt-form',
  templateUrl: 'emprunt-form.component.html',
})

export class EmpruntFormComponent implements OnInit {
  emprunt: Emprunt;
  form;

  constructor(
    private _empruntBackendService: EmpruntBackendService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    const empruntId = this.route.snapshot.paramMap.get('id');
    if (empruntId)
      this.chargerEmprunt(empruntId);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Id: [''],
      date_debut: ['', Validators.required],
      date_fin: ['', Validators.required],
      destination : ['', Validators.required],
      commentaire : [''],
      type : ['', Validators.required],
    });

    // TODO all fields
    //this.form.controls.Libelle.updateValueAndValidity();
    //this.form.controls.².setValidators([Validators.required]);
  }

  sauver() {
    this.emprunt = new Emprunt(this.form.value);
    if (!this.emprunt.Id) {
      this.emprunt.Id = undefined;
      this.emprunt.Type = undefined;
      this.emprunt.Site = undefined;
      this.emprunt.Conducteur = undefined;
      this._empruntBackendService.addEmprunt(this.emprunt).subscribe(res => {
        this.router.navigate(['Digifleet/liste-emprunt']);
      });
    } else {
      let object:object = {
        'Id' : this.emprunt.Id,
        'date_debut': this.emprunt.DateDebut,
        'date_fin': this.emprunt.DateFin,
        'destination': this.emprunt.Destination,
        'commentaire': this.emprunt.Commentaire,
        'type': this.emprunt.Type,
      }

      this._empruntBackendService.updateEmprunt(object).subscribe(res => {
        this.router.navigate(['Digifleet/liste-emprunt']);
      });
    }
  }

  chargerEmprunt(id) {
    this._empruntBackendService.getEmprunt(id).subscribe(res => {
      this.emprunt = new Emprunt();
      this.emprunt = res;
      this.itemToForm(this.emprunt);
    });
  }

  itemToForm(emprunt: Emprunt){
    this.form.controls.Id.setValue(emprunt.Id);
    this.form.controls.date_debut.setValue(emprunt.DateDebut);
    this.form.controls.date_fin.setValue(emprunt.DateFin);
    this.form.controls.destination.setValue(emprunt.Destination);
    this.form.controls.commentaire.setValue(emprunt.Commentaire);
    this.form.controls.type.setValue(emprunt.Type);
  }

  public noWhitespaceValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const isOnlyWhitespace = c.value ? c.value.includes(' ') : false;
      const isValid = !isOnlyWhitespace;
      return isValid ? null : { onlyWhitespace: true };
    };
  }

  public noWhitespaceStartEndValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const isOnlyWhitespace = c.value ? c.value[0] === ' ' || c.value[c.value.length - 1] === ' ' : false;
      const isValid = !isOnlyWhitespace;
      return isValid ? null : { WhitespaceStartOrEnd: true };
    };
  }
}
