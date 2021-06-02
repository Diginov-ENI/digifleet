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
import { AuthInterceptor } from './services/authInterceptor.service';

import { UtilisateurFormComponent } from './components/utilisateur/utilisateur-form.component';
import { ConfirmDeleteUtilisateurDialogComponent, UtilisateurListComponent } from './components/utilisateur/utilisateur-list.component';
import { UtilisateurBackendService } from './backendservices/utilisateur.backendservice';
import { SiteFormComponent } from './components/site/site-form.component';
import { ConfirmDeleteSiteDialogComponent, SiteListComponent } from './components/site/site-list.component';
import { SiteBackendService } from './backendservices/site.backendservice';
import { VehiculeComponent } from './components/vehicule/vehicule.component';

Sentry.init({ dsn: environment.SENTRY_DSN });



@NgModule({
  declarations: [
    AppComponent,
    BandeauDigifleetComponent,
    DigifleetHomeComponent,
    ConnexionFormComponent,
    UtilisateurListComponent,
    UtilisateurFormComponent,
    ConfirmDeleteUtilisateurDialogComponent,
    SiteListComponent,
    SiteFormComponent,
    ConfirmDeleteSiteDialogComponent,
    VehiculeComponent,
    AlertComponent
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
    AuthService,
    AuthGuard,
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
