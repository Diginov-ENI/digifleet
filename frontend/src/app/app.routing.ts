import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurListComponent } from './components/utilisateur/utilisateur-list.component';
import { UtilisateurFormComponent } from './components/utilisateur/utilisateur-form.component';
import { VehiculeListComponent } from './components/vehicule/vehicule-list.component';
import { DigifleetHomeComponent } from './digifleet-home.component';
import { AuthGuard } from './services/authGuard.service';
import {ConnexionFormComponent} from './components/connexion/connexion-form.component';
import { VehiculeFormComponent } from './components/vehicule/vehicule-form.component';
import { SiteListComponent } from './components/site/site-list.component';
import { SiteFormComponent } from './components/site/site-form.component';
import { UtilisateurSecuriteComponent } from './components/utilisateur/utilisateur-securite.component';

// WIP - la gestion des routes est susceptible de changer, essayez d'ajouter proprement vos routes sur une ligne pour éviter les merge conflicts
export const APP_ROUTING = RouterModule.forRoot([
    { path: 'Digifleet', component: DigifleetHomeComponent, outlet: 'Digifleet' },
	{ path: 'connexion', component: ConnexionFormComponent },
], { scrollPositionRestoration: 'enabled' });


export const DETAILS_ROUTES_UTILISATEUR: Routes = 
    [
        {
            path: '', component: UtilisateurListComponent // à remplacer par le composant affichant la liste des utilisateurs
            // , data: { routeGuards: [DebugGuard, AuthGuard, BannerSizeGuard, RightsGuard] }, canActivate: [CompositeRouteGuard], ToDo
        },
        {
            path: 'utilisateur', component: UtilisateurFormComponent
        },
        {
            path: 'utilisateur/:id', component: UtilisateurFormComponent
        },
    ];

export const DETAILS_ROUTES_SITE: Routes = 
    [
        {
            path: '', component: SiteListComponent
        },
        {
            path: 'site', component: SiteFormComponent
        },
        {
            path: 'site/:id', component: SiteFormComponent
        },
    ];   
    
export const DETAILS_ROUTES_MON_COMPTE: Routes = [
    {
        path: '',
        redirectTo: 'securite',
        pathMatch: 'prefix'
      },
      {
        path: 'securite', component: UtilisateurSecuriteComponent
      },
    ];


export const DETAILS_ROUTES_VEHICULE: Routes = [
    {
        path: '', component: VehiculeListComponent 
        },
        {
          path: 'vehicule', component: VehiculeFormComponent
        },
        {
          path: 'vehicule/:id', component: VehiculeFormComponent
        },
    ];

export const DETAILS_ROUTES: Routes = [
    {
        path: 'Digifleet',
        component: DigifleetHomeComponent,
        children: [
            { path: 'liste-vehicule', children: DETAILS_ROUTES_VEHICULE },
            { path: 'liste-utilisateur', children: DETAILS_ROUTES_UTILISATEUR },     
            { path: 'liste-site', children: DETAILS_ROUTES_SITE },     
            { path: 'mon-compte', children: DETAILS_ROUTES_MON_COMPTE },     
        ],
        canActivate:[AuthGuard]
    },
    {
        path: 'connexion',
        component: ConnexionFormComponent,
    },
    {
        path: '',
        redirectTo: 'Digifleet',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(DETAILS_ROUTES)],
    exports: [RouterModule]
  })
export class AppRoutingModule { }