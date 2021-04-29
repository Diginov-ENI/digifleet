
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay, first, filter } from 'rxjs/operators';
import jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';

@Injectable()
export class AuthService {
  private apiRoot = '/api/auth/';
  private currentUserSubject = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient,private _utilisateurBackendService: UtilisateurBackendService) {
    this.loadUserFromLocalStorage();
  }

  private setSession(authResult) {
    const token = authResult.token; 
    const payload = <JWTPayload>jwtDecode(token);
    const expiresAt = moment.unix(payload.exp);
    
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    
    this.setCurrentUser(payload.user_id);
  }

  private setCurrentUser(id){
    var self = this;
    this._utilisateurBackendService.getUtilisateur(id).subscribe(user => {
      localStorage.setItem('user', JSON.stringify(user));
      self.currentUserSubject.next(user);
     });
  }

  private loadUserFromLocalStorage(){
    var user = JSON.parse(localStorage.getItem('user'));
    if(user === null){
      this.logout();
    }
    this.currentUserSubject.next(user);
  }

  public refreshUserData(){
    var self = this;
    this.getUser().pipe(first()).subscribe(user=>{
      self.setCurrentUser(user.id);
    });

  }

  public getUser(): Observable<any> {
    return this.currentUserSubject.asObservable().pipe(filter(x => !!x));
  }

  get token(): string {
    return localStorage.getItem('token');
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
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
  }

  refreshToken() {
    if (moment().isBetween(this.getExpiration().subtract(30, 'minutes'), this.getExpiration())) {
      return this.http.post(
        this.apiRoot.concat('refresh-token/'),
        { token: this.token }
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