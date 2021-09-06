import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, ErrorHandler, Injectable,  } from '@angular/core';
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
import { EmpruntFilters } from './components/emprunt/components/filters/emprunt-filters.component';
import { EmpruntBackendService } from './backendservices/emprunt.backendservice';
import { DialogSelectVehicule } from './components/emprunt/emprunt-list.component';

import { VehiculeFormComponent } from './components/vehicule/vehicule-form.component';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { ToastHelperComponent } from './components/toast-message/toast-message.component';
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
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

 import {PassagerChips} from './components/emprunt/passager-chips/passager-chips.component';
import { NotificationComponent } from './components/bandeau-digifleet/notifications/notifications.component';
import { NotificationBackendService } from './backendservices/notification.backendservice';

Sentry.init({ dsn: environment.SENTRY_DSN });

export const DATE_FORMAT = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

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
    DialogSelectVehicule,
    EmpruntActions,
    EmpruntFilters,
    AlertComponent,
    DialogConfirmComponent,
    ToastHelperComponent,
    PassagerChips,
    NotificationComponent
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
    { provide: ErrorHandler, useValue: Sentry.createErrorHandler({
      showDialog: false,
    }) },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT},
    UtilisateurBackendService,
    SiteBackendService,
    GroupeBackendService,
    PermissionTypeBackendService,
    EmpruntBackendService,
    AuthService,
    AuthGuard,
    VehiculeBackendService,
    NotificationBackendService,
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
