import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'connexion-form',
  templateUrl: 'connexion-form.component.html',
  styleUrls: ['connexion-form.component.scss'],
})
export class ConnexionFormComponent {
  HOME_ROUTE = '/Digifleet/liste-emprunt';
  SECU_ROUTE = '/Digifleet/mon-compte/securite';
  private _connectedUser: Utilisateur = null;

  password = '';
  username = '';
  hidePassword = true;
  errors: any;

  private _destroy$ = new Subject<void>();

  constructor(
    private _authService: AuthService,
    private _router: Router,
  ) {
    if (this._authService.isLoggedIn()) {
      this._router.navigate([this.HOME_ROUTE])
    }
  }

  ngOnInit() {
    this._authService.utilisateurConnecte$
      .pipe(takeUntil(this._destroy$), filter(user => (user !== null && user !== undefined)))
      .subscribe(utilisateur => {
        this._connectedUser = utilisateur;
        if (this._connectedUser != null) {
          this.handleSuccess();
        }
      });
  }

  ngOnDestroy() {
    this._destroy$.next();
  }

  login(username: string, password: string) {
    this._authService.login(username, password).subscribe(
      error => this.handleError(error)
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.login(this.username, this.password);
  }

  handleSuccess() {
    this.username = '';
    this.password = '';

    if (this._connectedUser != null && this._connectedUser.IsPasswordToChange) {
      this._router.navigate([this.SECU_ROUTE])
    }
    else {
      this._router.navigate([this.HOME_ROUTE]);
    }
  }

  handleError(error) {
    this.errors = []
    if ((error.status >= 500 && error.status <= 599) || error.status == 0) {
      this.errors.push("Erreur serveur");
    } else {
      var errorsObj = error.error;
      var errorsSorted = [];
      for (let key in errorsObj) {
        if (typeof errorsObj[key] == "string") {
          errorsSorted.push({
            type: key,
            message: errorsObj[key]
          })
        } else {
          for (let message of errorsObj[key]) {
            errorsSorted.push({
              type: key,
              message: message
            })
          }
        }
      }
      for (let error of errorsSorted) {
        switch (error.type) {
          case "email":
            switch (error.message) {
              case "This field may not be blank.":
                this.errors.push("L'adresse email ne doit pas etre vide")
                break;
              default:
                this.errors.push(error.message);
                break;
            }
            break;
          case "password":
            switch (error.message) {
              case "This field may not be blank.":
                this.errors.push("Le mot de passe ne doit pas etre vide")
                break;
              default:
                this.errors.push(error.message);
                break;
            }
            break;
          case "global":
            switch (error.message) {
              case "Unable to log in with provided credentials.":
                this.errors.push("Votre adresse email ou mot de passe est incorrect.")
                break;
              default:
                this.errors.push(error.message);
                break;
            }
            break;
          case "detail":
            switch (error.message) {
              case "No active account found with the given credentials":
                this.errors.push("Votre adresse email ou mot de passe est incorrect.")
                break;
              default:
                this.errors.push(error.message);
                break;
            }
            break;
          default:
            this.errors.push(error.type + ": " + error.message);
            break;
        }
      }
    }
  }
}
