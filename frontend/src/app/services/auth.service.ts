
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import * as Sentry from '@sentry/angular';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private apiRoot = environment.API_URL + 'auth/';
  public utilisateurConnecte$: BehaviorSubject<Utilisateur> = new BehaviorSubject<Utilisateur>(new Utilisateur());
  constructor(private http: HttpClient, private _utilisateurBackendService: UtilisateurBackendService) {
    this.loadUserFromLocalStorage();
  }

  private setSession(authResult) {
    const token = authResult.access;
    const payload = <JWTPayload>jwtDecode(token);
    const expiresAt = moment.unix(payload.exp);

    localStorage.setItem('token', authResult.access);
    localStorage.setItem('refresh', authResult.refresh);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

    Sentry.addBreadcrumb({
      category: "auth",
      message: "Sauvegarde du token JWT",
      data: {
        token: token
      },
      level: Sentry.Severity.Info,
    });

    this.setCurrentUser(payload.user_id);
  }

  private setCurrentUser(id) {
    var self = this;
    this._utilisateurBackendService.getUtilisateur(id).subscribe(result => {
      if (result.IsSuccess) {
        var utilisateur = new Utilisateur(result.Data);
        localStorage.setItem('user', JSON.stringify(result.Data));

        Sentry.addBreadcrumb({
          category: "info",
          message: "Sauvegarde des informations de l'utilisateur dans le localstorage",
          data: {
            user: result.Data
          },
          level: Sentry.Severity.Info,
        });
        self.utilisateurConnecte$.next(utilisateur);
      }
    });
  }

  private loadUserFromLocalStorage() {
    var user = JSON.parse(localStorage.getItem('user'));
    var utilisateur = new Utilisateur(user);
    Sentry.addBreadcrumb({
      category: "info",
      message: "Chargement des informations de l'utilisateur depuis le localstorage",
      data: {
        user: user
      },
      level: Sentry.Severity.Info,
    });

    if (user === null) {
      this.logout();
    } else {
      this.utilisateurConnecte$.next(utilisateur);
    }
  }

  public refreshUserData() {
    Sentry.addBreadcrumb({
      category: "info",
      message: "Déclenchement du rafraichissement des données utilisateurs",
      level: Sentry.Severity.Info,
    });

    this.setCurrentUser(this.utilisateurConnecte$.value?.Id)
  }

  get token(): string {
    return localStorage.getItem('token');
  }

  get refresh(): string {
    return localStorage.getItem('refresh');
  }
  
  login(email: string, password: string) {

    return this.http.post(
      this.apiRoot.concat('login/'),
      { email, password }
    ).pipe(
      tap(response => this.setSession(response)),
      shareReplay(),
    );
  }


  logout() {
    Sentry.addBreadcrumb({
      category: "auth",
      message: "Deconnexion de l'utilisateur, vidage du localstorage",
      level: Sentry.Severity.Info,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    this.utilisateurConnecte$.next(new Utilisateur());
  }

  refreshToken() {
    if (moment().isBetween(this.getExpiration().subtract(30, 'minutes'), this.getExpiration())) {
      Sentry.addBreadcrumb({
        category: "auth",
        message: "Déclanchement de la mise a jour du token JWT",
        level: Sentry.Severity.Info,
      });
      return this.http.post(
        this.apiRoot.concat('refresh-token/'),
        { refresh: this.refresh }
      ).pipe(
        tap(response => this.setSession(response)),
        shareReplay(),
      ).subscribe();
    }
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);

    return moment(expiresAt);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}


interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
  exp: number;
}