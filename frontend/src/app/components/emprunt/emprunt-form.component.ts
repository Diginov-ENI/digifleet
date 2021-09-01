import { Component, OnInit , ViewChild} from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { Site } from 'src/app/models/site';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';

import { AuthService } from 'src/app/services/auth.service';
import { PassagerChips } from './passager-chips/passager-chips.component';

@Component({
  selector: 'emprunt-form',
  templateUrl: 'emprunt-form.component.html',
})

export class EmpruntFormComponent implements OnInit {
  emprunt: Emprunt;
  utilisateurs: Utilisateur[];
  passager: Utilisateur[];
  sites: Site[];
  site: Site;
  format: string = 'YYYY-MM-DD[T]HH:mm:ss[Z]';
  form;
  groupeTooltip = null;
  private connectedUser: Utilisateur = null;

  @ViewChild('passagerChips') passagerChips: PassagerChips;
  constructor(
    private _empruntBackendService: EmpruntBackendService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _siteBackendService: SiteBackendService,
    private _utilisateurBackendService:UtilisateurBackendService,
    private authService: AuthService,
  ) {
    const empruntId = this.route.snapshot.paramMap.get('id');
    if (empruntId)
      this.chargerEmprunt(empruntId);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Id: [''],
      DateDebut: ['', Validators.required],
      DateFin: [''],
      Destination : ['', Validators.required],
      Commentaire : [''],
      Type : ['', Validators.required],
      Site: [''] ,
      Passager: [''] ,
    });
    this.getAvailablesSites();
    this.authService.getUser().subscribe(user => this.connectedUser = user);
    
    this.form.controls.Site.setValidators([Validators.required]);
  }
  getAvailablesSites() {
    this._siteBackendService.getAvailablesSites().subscribe(response => {
      this.sites = response.Data;
    })
  }
  getUtilisateurs() {
    this._utilisateurBackendService.getUtilisateurs().subscribe(response => {
      this.utilisateurs = response.Data;
    })
  }

  sauver() {
    this.emprunt = new Emprunt(this.form.value);
    let site: Site = {'Id': this.form.controls.Site.value, 'Libelle': undefined, 'IsActive': undefined}
    if (!this.emprunt.Id) {
      this.emprunt.Id = undefined;
      this.emprunt.DateDebut = this.form.controls.DateDebut.value.format(this.format);
      this.emprunt.DateFin = this.form.controls.DateFin.value ? this.form.controls.DateFin.value.format(this.format) : undefined;
      this.emprunt.Site = site;
      this.emprunt.Statut="DEPOSEE";
      this.emprunt.Passagers =this.getSelectedPassagers();
      this.emprunt.Conducteur = this.connectedUser;
      this._empruntBackendService.addEmprunt(this.emprunt).subscribe(res => {
        if (res.IsSuccess) {
          this.router.navigate(['Digifleet/liste-emprunt']);
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Emprunt créé avec succès.'));
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    } else {
      let object:object = {
        'Id' : this.emprunt.Id,
        'DateDebut': this.emprunt.DateDebut,
        'DateFin': this.emprunt.DateFin,
        'Destination': this.emprunt.Destination,
        'Commentaire': this.emprunt.Commentaire,
        'Type': this.emprunt.Type,
        'Site' :  this.emprunt.Site,
        'Passager' :  this.getSelectedPassagers(),
      }

      this._empruntBackendService.updateEmprunt(object).subscribe(res => {
        this.router.navigate(['Digifleet/liste-emprunt']);
      });
    }
  }

  chargerEmprunt(id) {
    this._empruntBackendService.getEmprunt(id).subscribe(res => {
      this.emprunt = new Emprunt();
      this.emprunt = res.Data;
      this.itemToForm(this.emprunt);
    });
  }

  itemToForm(emprunt: Emprunt){
    this.form.controls.Id.setValue(emprunt.Id);
    this.form.controls.DateDebut.setValue(emprunt.DateDebut);
    this.form.controls.DateFin.setValue(emprunt.DateFin);
    this.form.controls.Destination.setValue(emprunt.Destination);
    this.form.controls.Commentaire.setValue(emprunt.Commentaire);
    this.form.controls.Type.setValue(emprunt.Type);
    this.form.controls.Site.setValue(emprunt.Site.Id);
    this.form.controls.passager.setValue(emprunt.Passagers);
  }

  getSelectedPassagers(): Utilisateur[] {
    return this.passagerChips.getPassagers();
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