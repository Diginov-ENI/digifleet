import { RouterModule, Routes } from '@angular/router';
import { UtilisateurListComponent } from './components/utilisateur/utilisateur-list.component';
import { UtilisateurFormComponent } from './components/utilisateur/utilisateur-form.component';
import { VehiculeComponent } from './components/vehicule/vehicule.component';
import { DigifleetHomeComponent } from './digifleet-home.component';
import { AuthGuard } from './services/authGuard.service';
import {ConnexionFormComponent} from './components/connexion/connexion-form.component';

// WIP - la gestion des routes est susceptible de changer, essayez d'ajouter proprement vos routes sur une ligne pour éviter les merge conflicts
export const APP_ROUTING = RouterModule.forRoot([
    { path: 'Digifleet', component: DigifleetHomeComponent, outlet: 'Digifleet' },
	{ path: 'connexion', component: ConnexionFormComponent },
], { scrollPositionRestoration: 'enabled' });

export const DETAILS_ROUTES_UTILISATEUR: Routes = [
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

export const DETAILS_ROUTES: Routes = [
    {
        path: 'Digifleet',
        component: DigifleetHomeComponent,
        children: [
            { path: 'liste-vehicule', component: VehiculeComponent },
            { path: 'liste-utilisateur', children: DETAILS_ROUTES_UTILISATEUR },     
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
