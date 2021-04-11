import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { UtilisateurFormComponent } from './components/utilisateur/utilisateur-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { BandeauDigifleetComponent } from './components/bandeau-digifleet/bandeau-digifleet.component';
import { DigifleetHomeComponent } from './digifleet-home.component';
import { APP_ROUTING, DETAILS_ROUTES } from './app.routing';
import { UtilisateurBackendService } from './backendservices/utilisateur.backendservice';
import { VehiculeComponent } from './components/vehicule/vehicule.component';
import { ConnexionFormComponent } from './components/connexion/connexion-form.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertComponent } from './components/alert/alert.component';
import { AuthService} from './services/auth.service';
import { AuthGuard } from './services/authGuard.service';
import { AuthInterceptor } from './services/authInterceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    UtilisateurFormComponent,
    BandeauDigifleetComponent,
    DigifleetHomeComponent,
    VehiculeComponent,
    ConnexionFormComponent,
    AlertComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    BrowserAnimationsModule,
    MaterialModule,
    APP_ROUTING,
    RouterModule.forChild(DETAILS_ROUTES),
    HttpClientModule,
    FormsModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UtilisateurBackendService,
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
