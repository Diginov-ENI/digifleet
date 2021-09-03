import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import { Subject } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'utilisateur-securite',
  templateUrl: 'utilisateur-securite.component.html',
})

export class UtilisateurSecuriteComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject<void>();

  passwordForm = new FormGroup({
    oldPassword: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    passwordAgain: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      matchOtherValidator("password")
    ])
  });

  public errors: any;
  public success: any;
  private _connectedUser: Utilisateur = null;
  EMPRUNT_ROUTE = '/Digifleet/liste-emprunt';

  constructor(
    private _authService: AuthService,
    private _utilisateurBackendService: UtilisateurBackendService,
    private _snackBar: MatSnackBar,
    private _router: Router,
  ) {
    this._authService.utilisateurConnecte$
      .pipe(takeUntil(this._destroy$), filter(user => (user !== null && user !== undefined)))
      .subscribe(utilisateur => this._connectedUser = utilisateur);
  }

  ngOnInit() {
    if (this._connectedUser.IsPasswordToChange) {
      this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setInfoToast(true, 'Veuillez changer votre mot de passe'));
    }
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  onFormPasswordChange() {
    if (this.formIsValid()) {
      this.errors = null;
      this.success = null;
      let object: object = {
        'Id': this._connectedUser.Id,
        'Password': this.passwordForm.get('password').value,
        'OldPassword': this.passwordForm.get('oldPassword').value,
      }
      try {
        this._utilisateurBackendService.updatePasswordUtilisateur(object).subscribe(res => {
          this.success = ["Votre mot de passe a bien été modifié."];
          this.clearPasswordForm();
        },
          error => {

            var tmp = [];
            if (typeof error.error.Password == 'object') {
              tmp = tmp.concat(error.error.Password)
            }

            if (typeof error.error.OldPassword == 'object') {
              tmp = tmp.concat(error.error.OldPassword)
            }
            this.errors = tmp;
          });
      } catch (error) {
      }
    }
  }

  formIsValid() {
    return this.passwordForm.controls.password.errors == null && this.passwordForm.controls.passwordAgain.errors == null
  }

  clearPasswordForm() {
    this.passwordForm.setValue({ oldPassword: '', password: '', passwordAgain: '' });

    if (this._connectedUser.IsPasswordToChange) {
      this._authService.refreshUserData();
      this._router.navigate([this.EMPRUNT_ROUTE])
      this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Votre mot de passe a bien été modifié.'));
    }
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const confirmPassword: string = control.get('passwordAgain').value;
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('passwordAgain').setErrors({ NoPassswordMatch: true });
    }
  }

  messageTranslate(message) {
    switch (message) {
      case "This password is too common.":
        return "Le nouveau mot de passe est trop commun.";
      default:
        return message;
    }
  }
}

function matchOtherValidator(otherControlName: string) {

  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate(control: FormControl) {

    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true
      };
    }
    return null;
  }
}
