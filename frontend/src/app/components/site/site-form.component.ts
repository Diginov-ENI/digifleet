import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { Site } from 'src/app/models/site';
import { ToastHelperComponent } from '../toast-message/toast-message.component';

@Component({
  selector: 'site-form',
  templateUrl: 'site-form.component.html',
})

export class SiteFormComponent implements OnInit {
  site: Site;
  form;

  constructor(
    private _siteBackendService: SiteBackendService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
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
        if (res.IsSuccess) {
          this.router.navigate(['Digifleet/liste-site']);
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Site ajouté avec succès.'));
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    } else {
      let object: object = {
        'Id': this.site.Id,
        'Libelle': this.site.Libelle,
      }

      this._siteBackendService.updateSite(object).subscribe(res => {
        if(res.IsSuccess) {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Site modifié avec succès.'));
          this.router.navigate(['Digifleet/liste-site']);
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    }
  }

  chargerSite(id) {
    this._siteBackendService.getSite(id).subscribe(res => {
      if (res.IsSuccess) {
        this.site = new Site();
        this.site = res.Data;
        this.itemToForm(this.site);
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }
    });
  }

  itemToForm(site: Site) {
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
