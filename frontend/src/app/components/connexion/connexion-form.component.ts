import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'connexion-form',
  templateUrl: 'connexion-form.component.html',
  styleUrls: ['connexion-form.component.scss'],
})
export class ConnexionFormComponent {
  HOME_ROUTE = '/Digifleet';

  password = '';
  username = '';
  hidePassword = true;
  errors: any;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.HOME_ROUTE])
    }

  }
  login(username: string, password: string) {
    this.authService.login(username, password).subscribe(
      success => this.handleSuccess(),
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
    this.router.navigate([this.HOME_ROUTE]);
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
                this.errors.push( error.message);
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