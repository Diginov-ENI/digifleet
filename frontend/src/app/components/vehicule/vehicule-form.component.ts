import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { Vehicule } from 'src/app/models/vehicule';

@Component({
  selector: 'vehicule-form',
  templateUrl: 'vehicule-form.component.html',
})

export class VehiculeFormComponent implements OnInit {
  vehicule: Vehicule;
  form;


  constructor(private _vehiculeBackendService: VehiculeBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
      //console.log("constructor")
    const vehiculeId = this.route.snapshot.paramMap.get('id');
    if (vehiculeId)
      this.chargerVehicule(vehiculeId);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Id: [''],
      Immatriculation: [''],
      Modele: [''],
      Marque: [''],
      Couleur: [''],
      NbPlace: ['']
    });

    this.form.controls.Immatriculation.setValidators([Validators.required,
      this.noWhitespaceStartEndValidator()]);

    this.form.controls.Modele.setValidators([Validators.required,
      this.noWhitespaceStartEndValidator()]);

    this.form.controls.Marque.setValidators([Validators.required,
      this.noWhitespaceStartEndValidator()]);

    this.form.controls.Couleur.setValidators([Validators.required,
      this.noWhitespaceStartEndValidator()]);

    this.form.controls.NbPlace.setValidators([Validators.required]);
  }

  sauver() {
    this.vehicule = new Vehicule(this.form.value);

    if (!this.vehicule.Id) {
      this.vehicule.Id = undefined;
      this._vehiculeBackendService.addVehicule(this.vehicule).subscribe(res => {
        this.router.navigate(['Digifleet/liste-vehicule']);
      });
    } else {
      let object:object = {
        'Id' : this.vehicule.Id,
        'Immatriculation' : this.vehicule.Immatriculation,
        'Modele' : this.vehicule.Modele,
        'Marque' : this.vehicule.Marque,
        'Couleur' : this.vehicule.Couleur,
        'NbPlace' : this.vehicule.NbPlace
      }

      this._vehiculeBackendService.updateVehicule(object).subscribe(res => {
        this.router.navigate(['Digifleet/liste-vehicule']);
      });
    }
  }

  chargerVehicule(id) {
    this._vehiculeBackendService.getVehicule(id).subscribe(res => {
      this.vehicule = new Vehicule();
      this.vehicule = res;
      this.itemToForm(this.vehicule);
    });
  }

  itemToForm(vehicule: Vehicule){
    this.form.controls.Id.setValue(vehicule.Id);
    this.form.controls.Immatriculation.setValue(vehicule.Immatriculation);
    this.form.controls.Modele.setValue(vehicule.Modele);
    this.form.controls.Marque.setValue(vehicule.Marque);
    this.form.controls.Couleur.setValue(vehicule.Couleur);
    this.form.controls.NbPlace.setValue(vehicule.NbPlace);
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
