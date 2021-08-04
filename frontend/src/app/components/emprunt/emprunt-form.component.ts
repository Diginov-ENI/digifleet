import { Component, OnInit , ElementRef, ViewChild} from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { Site } from 'src/app/models/site';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';

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
  private connectedUser: Utilisateur = null;

  constructor(
    private _empruntBackendService: EmpruntBackendService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
      DateFin: ['', Validators.required],
      Destination : ['', Validators.required],
      Commentaire : [''],
      Type : ['', Validators.required],
      Site: [''] ,
      // Passager: [''] ,
    });
    this.getSites();
    this.getUtilisateurs();
    this.authService.getUser().subscribe(user => this.connectedUser = user);
    
    this.form.controls.Site.setValidators([Validators.required]);
  }
  getSites() {
    this._siteBackendService.getSites().subscribe(response => {
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
    let site: Site = {'Id': this.form.controls.Site.value, 'Libelle': undefined}
    if (!this.emprunt.Id) {
      this.emprunt.Id = undefined;
      this.emprunt.Passagers = [];
      this.emprunt.DateDebut = this.form.controls.DateDebut.value.format(this.format);
      this.emprunt.DateFin = this.form.controls.DateFin.value.format(this.format);
      this.emprunt.Site = site;
      this.emprunt.Conducteur = this.connectedUser;
      this._empruntBackendService.addEmprunt(this.emprunt).subscribe(res => {
        this.router.navigate(['Digifleet/liste-emprunt']);
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
        // 'Passager' :  this.emprunt.Passagers,
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
    // this.form.controls.passager.setValue(emprunt.Passagers);
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

// export class ChipsPassager {
//   selectable = true;
//   removable = true;
//   separatorKeysCodes: number[] = [ENTER, COMMA];
//   passagerCtrl = new FormControl();
//   filteredPassager: Observable<Utilisateur[]>;
//   passagers: Utilisateur[];
//   utilisateurs: Utilisateur[];

//   @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

//   constructor(
//     private _utilisateurBackendService:UtilisateurBackendService,
//   ) {
//     this.filteredPassager = this.passagerCtrl.valueChanges.pipe(
//         startWith(null),
//         map((utilisateur.Nom + utilisateur.Prenom: String | null) => utilisateur ? this._filter(utilisateur.Nom+utilisateur.Prenom) : this.utilisateurs.slice()));
    
//   }
//   getUtilisateurs() {
//     this._utilisateurBackendService.getUtilisateurs().subscribe(response => {
//       this.utilisateurs = response.Data;
//     })
//   }
//   add(event: MatChipInputEvent): void {
//     const value = (event.value || '').trim();

//     // Add our fruit
//     if (value) {
//       this.passagers.push(value);
//     }

//     // Clear the input value
//     event.chipInput!.clear();

//     this.passagerCtrl.setValue(null);
//   }

//   remove(user: Utilisateur): void {
//     const index = this.passagers.indexOf(user);

//     if (index >= 0) {
//       this.passagers.splice(index, 1);
//     }
//   }

//   selected(event: MatAutocompleteSelectedEvent): void {
//     this.passagers.push(event.option.viewValue);
//     this.fruitInput.nativeElement.value = '';
//     this.passagerCtrl.setValue(null);
//   }

//   private _filter(value: string): Utilisateur[] {
//     const filterValue = value.toLowerCase();

//     return this.utilisateurs.filter(utilisateur => utilisateur.Nom.toLowerCase().includes(filterValue));
//   }
// }