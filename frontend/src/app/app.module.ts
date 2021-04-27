import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { ConfirmDeleteDialogComponent, UtilisateurListComponent } from './components/utilisateur/utilisateur-list.component';
import { UtilisateurFormComponent } from './components/utilisateur/utilisateur-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { BandeauDigifleetComponent } from './components/bandeau-digifleet/bandeau-digifleet.component';
import { DigifleetHomeComponent } from './digifleet-home.component';
import { APP_ROUTING, DETAILS_ROUTES } from './app.routing';
import { UtilisateurBackendService } from './backendservices/utilisateur.backendservice';
import { VehiculeComponent } from './components/vehicule/vehicule.component';

import { HttpXsrfInterceptor } from './http-interceptors/HttpXsrfInterceptor'

@NgModule({
  declarations: [
    AppComponent,
    UtilisateurListComponent,
    ConfirmDeleteDialogComponent,
    UtilisateurFormComponent,
    BandeauDigifleetComponent,
    DigifleetHomeComponent,
    VehiculeComponent,
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
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpXsrfInterceptor, multi: true },
    UtilisateurBackendService,
  ],
  bootstrap: [AppComponent],
  exports: [
    RouterModule,
  ],
})
export class AppModule {}
