import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule, Router } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { BandeauDigifleetComponent } from './components/bandeau-digifleet/bandeau-digifleet.component';
import { DigifleetHomeComponent } from './digifleet-home.component';
import { APP_ROUTING, DETAILS_ROUTES } from './app.routing';
import { HttpXsrfInterceptor } from './http-interceptors/HttpXsrfInterceptor'
import * as Sentry from '@sentry/angular';
import { SentryIonicErrorHandler } from './services/sentry-ionic-error-handler';
import { environment } from './../environments/environment';
import { ConnexionFormComponent } from './components/connexion/connexion-form.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuthService} from './services/auth.service';
import { AuthGuard } from './services/authGuard.service';
import { VehiculeBackendService } from './backendservices/vehicule.backendservice';
import { VehiculeListComponent } from './components/vehicule/vehicule-list.component';
import { AuthInterceptor } from './http-interceptors/authInterceptor';

import { UtilisateurFormComponent } from './components/utilisateur/utilisateur-form.component';
import { UtilisateurSecuriteComponent } from './components/utilisateur/utilisateur-securite.component';
import { UtilisateurListComponent } from './components/utilisateur/utilisateur-list.component';
import { UtilisateurBackendService } from './backendservices/utilisateur.backendservice';

import { SiteFormComponent } from './components/site/site-form.component';
import { SiteListComponent } from './components/site/site-list.component';
import { SiteBackendService } from './backendservices/site.backendservice';

import { EmpruntFormComponent } from './components/emprunt/emprunt-form.component';
import { EmpruntListComponent } from './components/emprunt/emprunt-list.component';
import { EmpruntActions } from './components/emprunt/components/emprunt-actions.component';
import { EmpruntBackendService } from './backendservices/emprunt.backendservice';

import { VehiculeFormComponent } from './components/vehicule/vehicule-form.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { GroupeBackendService } from './backendservices/groupe.backendservice';
import { GroupeListComponent} from './components/groupe/groupe-list.component';
import { ConfirmDeleteGroupeDialogComponent } from './components/groupe/dialogs/confirm-delete-groupe-dialog.component';
import { GroupeFormComponent } from './components/groupe/groupe-form.component';
import { PermissionTypeBackendService } from './backendservices/permissiontype.backendservice';
import { UtilisateurChips } from './components/groupe/utilisateur-chips/utilisateur-chips.component';
import { GroupeChips } from './components/utilisateur/groupe-chips/groupe-chips.component';
import { PermissionTypeComponent } from './components/permission/permission-type.component';
import { PermissionFormComponent } from './components/permission/permission-form.component';
import { UtilisateurPermissionComponent } from './components/utilisateur/utilisateur-permission/utilisateur-permission.component';

Sentry.init({ dsn: environment.SENTRY_DSN });



@NgModule({
  declarations: [
    AppComponent,
    UtilisateurListComponent,
    UtilisateurFormComponent,
    BandeauDigifleetComponent,
    DigifleetHomeComponent,
    VehiculeFormComponent,
    VehiculeListComponent,
    ConnexionFormComponent,
    AlertComponent,
    VehiculeListComponent,
    UtilisateurListComponent,
    UtilisateurFormComponent,
    UtilisateurSecuriteComponent,
    UtilisateurChips,
    GroupeChips,
    SiteListComponent,
    SiteFormComponent,
    GroupeListComponent,
    GroupeFormComponent,
    PermissionTypeComponent,
    PermissionFormComponent,
    ConfirmDeleteGroupeDialogComponent,
    AlertComponent,
    UtilisateurPermissionComponent,
    SiteListComponent,
    SiteFormComponent,
    EmpruntListComponent,
    EmpruntFormComponent,
    EmpruntActions,
    AlertComponent,
    DialogConfirmComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken',
    }),
    IonicModule.forRoot(), 
    BrowserAnimationsModule,
    MaterialModule,
    APP_ROUTING,
    RouterModule.forChild(DETAILS_ROUTES),
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true },
    { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
    UtilisateurBackendService,
    SiteBackendService,
    GroupeBackendService,
    PermissionTypeBackendService,
    EmpruntBackendService,
    AuthService,
    AuthGuard,
    VehiculeBackendService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [
    RouterModule,
  ],
})
export class AppModule {}
