import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import * as Sentry from '@sentry/angular';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route,state) {
    if (this.authService.isLoggedIn()) {
      Sentry.addBreadcrumb({
        category: "auth",
        message: "AuthGuard Autorisé",
        level: Sentry.Severity.Info,
      });
      this.authService.refreshToken();
      return true;
    } else {
      Sentry.addBreadcrumb({
        category: "auth",
        message: "AuthGuard Refusé",
        level: Sentry.Severity.Info,
      });
      this.authService.logout();
      this.router.navigate(['/connexion']);

      return false;
    }
  }
}