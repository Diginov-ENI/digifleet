import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { Groupe } from 'src/app/models/groupe';
import { Utilisateur } from 'src/app/models/utilisateur';
import { AuthService } from 'src/app/services/auth.service';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { GroupeChips } from './groupe-chips/groupe-chips.component';

@Component({
  selector: 'utilisateur-form',
  templateUrl: 'utilisateur-form.component.html',
})

export class UtilisateurFormComponent implements OnInit, OnDestroy {
  @ViewChild('groupesChips') groupesChips: GroupeChips;
  
  private _connectedUser: Utilisateur = null;
  private _destroy$ = new Subject<void>();

  utilisateur: Utilisateur;
  form;
  groupeDisabled = false;
  groupeTooltip = null;

  constructor(
    private _utilisateurBackendService: UtilisateurBackendService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {
    const utilisateurId = this._route.snapshot.paramMap.get('id');
    if (utilisateurId)
      this.chargerUtilisateur(utilisateurId);
  }

  ngOnInit() {
    this._authService.utilisateurConnecte$
      .pipe(takeUntil(this._destroy$), filter(user => (user !== null && user !== undefined)))
      .subscribe(utilisateur => {
        this._connectedUser = utilisateur;
        this.loadDisabled();
      });

    this.form = this._formBuilder.group({
      Id: [''],
      Username: ['', Validators.required],
      Email: ['', [Validators.email, Validators.required]],
      Nom: ['', Validators.required],
      Prenom: ['', Validators.required],
      Groups: ['']
    });

    this.form.controls.Username.updateValueAndValidity();
    this.form.controls.Username.setValidators([Validators.required,
    this.noWhitespaceValidator()]);

    this.form.controls.Prenom.setValidators([Validators.required,
    this.noWhitespaceStartEndValidator()]);

    this.form.controls.Nom.setValidators([Validators.required,
    this.noWhitespaceStartEndValidator()]);
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  loadDisabled() {
    this.groupeDisabled = this._connectedUser && typeof this.utilisateur !== 'undefined' && this.utilisateur.Id === this._connectedUser.Id;
    if (this.groupeDisabled) {
      this.groupeTooltip = "Vous ne pouvez pas modifier vos groupes."
    } else {
      this.groupeTooltip = null;
    }
  }

  sauver() {
    this.utilisateur = new Utilisateur(this.form.value);

    if (!this.utilisateur.Id) {
      this.utilisateur.Id = undefined;
      this.utilisateur.Groups = this.getSelectedGroupes();
      this._utilisateurBackendService.addUtilisateur(this.utilisateur).subscribe(res => {
        if (res.IsSuccess) {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Utilisateur ajouté avec succès.'));
          this._router.navigate(['Digifleet/liste-utilisateur']);
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    } else {
      let object: object = {
        'Id': this.utilisateur.Id,
        'Username': this.utilisateur.Username,
        'Email': this.utilisateur.Email,
        'Nom': this.utilisateur.Nom,
        'Prenom': this.utilisateur.Prenom,
        'Groups': this.getSelectedGroupes()
      }

      this._utilisateurBackendService.updateUtilisateur(object).subscribe(res => {
        if (res.IsSuccess) {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Utilisateur modifié avec succès.'));
          if (res.Data.Id === this._connectedUser.Id) {
            this._authService.refreshUserData();
          }
          this._router.navigate(['Digifleet/liste-utilisateur']);
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    }
  }

  getSelectedGroupes(): Groupe[] {
    return this.groupesChips.getSelectedGroupes();
  }

  chargerUtilisateur(id) {
    this._utilisateurBackendService.getUtilisateur(id).subscribe(res => {
      if (res.IsSuccess) {
        this.utilisateur = res.Data;
        this.itemToForm(this.utilisateur);
        this.groupesChips.setSelectedGroupes(this.utilisateur.Groups)
        this.loadDisabled()
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }

    });
  }

  itemToForm(utilisateur: Utilisateur) {
    this.form.controls.Id.setValue(utilisateur.Id);
    this.form.controls.Username.setValue(utilisateur.Username);
    this.form.controls.Email.setValue(utilisateur.Email);
    this.form.controls.Nom.setValue(utilisateur.Nom);
    this.form.controls.Prenom.setValue(utilisateur.Prenom);
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
