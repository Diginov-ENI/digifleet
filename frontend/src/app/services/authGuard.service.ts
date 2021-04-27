import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route,state) {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken();
      console.log(route);
      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['/connexion']);

      return false;
    }
  }
}