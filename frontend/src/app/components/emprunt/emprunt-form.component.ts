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
      //Libelle: ['', Validators.required],
      // TODO all fields
    });

    // TODO all fields
    //this.form.controls.Libelle.updateValueAndValidity();
    //this.form.controls.².setValidators([Validators.required]);
  }

  sauver() {
    this.emprunt = new Emprunt(this.form.value);

    // ToDo factoriser le passage des champ vide à undefined
    if (!this.emprunt.Id) {
      this.emprunt.Id = undefined;
      this._empruntBackendService.addEmprunt(this.emprunt).subscribe(res => {
        this.router.navigate(['Digifleet/liste-emprunt']);
      });
    } else {
      let object:object = {
        'Id' : this.emprunt.Id,
        // TODO all fields
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
    // TODO all fields
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
