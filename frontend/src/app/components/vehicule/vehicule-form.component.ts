import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { VehiculeBackendService } from 'src/app/backendservices/vehicule.backendservice';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { Vehicule } from 'src/app/models/vehicule';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { Site } from 'src/app/models/site';
import { ToastHelperComponent } from '../toast-message/toast-message.component';

@Component({
  selector: 'vehicule-form',
  templateUrl: 'vehicule-form.component.html',
})

export class VehiculeFormComponent implements OnInit {
  vehicule: Vehicule;
  sites: Site[];
  site: Site;
  form;


  constructor(
    private _vehiculeBackendService: VehiculeBackendService,
    private _siteBackendService: SiteBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) {
    const vehiculeId = this.route.snapshot.paramMap.get('id');
    if (vehiculeId)
      this.chargerVehicule(vehiculeId);
  }

  ngOnInit() {
    this.getSites();

    this.form = this.formBuilder.group({
      Id: [''],
      Immatriculation: [''],
      Modele: [''],
      Marque: [''],
      Couleur: [''],
      NbPlace: [''],
      Site: ['']
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

    this.form.controls.Site.setValidators([Validators.required]);
  }

  getSites() {
    this._siteBackendService.getSites().subscribe(response => {
      this.sites = response.Data;
    })
  }

  sauver() {
    this.vehicule = new Vehicule(this.form.value);
    let site: Site = {'Id': this.form.controls.Site.value, 'Libelle': undefined}

    if (!this.vehicule.Id) {
      this.vehicule.Id = undefined;
      this.vehicule.Site = site;
      this._vehiculeBackendService.addVehicule(this.vehicule).subscribe(res => {
        if (res.IsSuccess) {
          this.router.navigate(['Digifleet/liste-vehicule']);
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Véhicule ajouté avec succès.'));
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    } else {
      let object: object = {
        'Id' : this.vehicule.Id,
        'Immatriculation' : this.vehicule.Immatriculation,
        'Modele' : this.vehicule.Modele,
        'Marque' : this.vehicule.Marque,
        'Couleur' : this.vehicule.Couleur,
        'NbPlace' : this.vehicule.NbPlace,
        'Site' : site,
      }

      this._vehiculeBackendService.updateVehicule(object).subscribe(res => {
        if (res.IsSuccess) {
          this.router.navigate(['Digifleet/liste-vehicule']);
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Véhicule modifié avec succès.'));
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    }
  }

  chargerVehicule(id) {
    this.vehicule = new Vehicule();
    this._vehiculeBackendService.getVehicule(id).subscribe(res => {
      if (res.IsSuccess) {
        this.vehicule = res.Data;
        this.itemToForm(this.vehicule);
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }
    });
  }

  itemToForm(vehicule: Vehicule) {
    this.form.controls.Id.setValue(vehicule.Id);
    this.form.controls.Immatriculation.setValue(vehicule.Immatriculation);
    this.form.controls.Modele.setValue(vehicule.Modele);
    this.form.controls.Marque.setValue(vehicule.Marque);
    this.form.controls.Couleur.setValue(vehicule.Couleur);
    this.form.controls.NbPlace.setValue(vehicule.NbPlace);
    this.form.controls.Site.setValue(vehicule.Site.Id);
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
