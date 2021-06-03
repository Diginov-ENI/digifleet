import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { Site } from 'src/app/models/site';

@Component({
  selector: 'site-form',
  templateUrl: 'site-form.component.html',
})

export class SiteFormComponent implements OnInit {
  site: Site;
  form;

  ProfilsSite = [{
    id: 1,
    valeur: 'Tous les droits'
  },
  {
    id: 2,
    valeur: 'Back office'
  }
  ]

  constructor(
    private _siteBackendService: SiteBackendService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {
    const siteId = this.route.snapshot.paramMap.get('id');
    if (siteId)
      this.chargerSite(siteId);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Id: [''],
      Libelle: ['', Validators.required],
    });

    this.form.controls.Libelle.updateValueAndValidity();
    this.form.controls.Libelle.setValidators([Validators.required]);
  }

  sauver() {
    this.site = new Site(this.form.value);

    // ToDo factoriser le passage des champ vide à undefined
    if (!this.site.Id) {
      this.site.Id = undefined;
      this._siteBackendService.addSite(this.site).subscribe(res => {
        this.router.navigate(['Digifleet/liste-site']);
      });
    } else {
      let object:object = {
        'Id' : this.site.Id,
        'Libelle' : this.site.Libelle,
      }

      this._siteBackendService.updateSite(object).subscribe(res => {
        this.router.navigate(['Digifleet/liste-site']);
      });
    }
  }

  chargerSite(id) {
    this._siteBackendService.getSite(id).subscribe(res => {
      this.site = new Site();
      this.site = res;
      this.itemToForm(this.site);
    });
  }

  itemToForm(site: Site){
    this.form.controls.Id.setValue(site.Id);
    this.form.controls.Libelle.setValue(site.Libelle);
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
