import { RouterModule, Routes } from '@angular/router';
import { UtilisateurListComponent } from './components/utilisateur/utilisateur-list.component';
import { VehiculeComponent } from './components/vehicule/vehicule.component';
import { DigifleetHomeComponent } from './digifleet-home.component';

// WIP - la gestion des routes est susceptible de changer, essayez d'ajouter proprement vos routes sur une ligne pour éviter les merge conflicts
export const APP_ROUTING = RouterModule.forRoot([
    { path: 'Digifleet', component: DigifleetHomeComponent, outlet: 'Digifleet' },
    { path: 'login', component: DigifleetHomeComponent }, // ToDo remplacer DigifleetHomeComponent par le component de connexion
], { scrollPositionRestoration: 'enabled' });

export const DETAILS_ROUTES_UTILISATEUR: Routes = [
    {
        path: '', component: UtilisateurListComponent
        // , data: { routeGuards: [DebugGuard, AuthGuard, BannerSizeGuard, RightsGuard] }, canActivate: [CompositeRouteGuard], ToDo
      },
      {
        path: 'utilisateur', component: UtilisateurListComponent // TODO : remplacer par "UtilisateurFormComponent"
      },
      {
        path: 'utilisateur/:id', component: UtilisateurListComponent // TODO : remplacer par "UtilisateurFormComponent"
      },
    ];

export const DETAILS_ROUTES: Routes = [
    {
        path: 'Digifleet',
        component: DigifleetHomeComponent,
        children: [
            { path: 'liste-vehicule', component: VehiculeComponent },
            { path: 'liste-utilisateur', children: DETAILS_ROUTES_UTILISATEUR },        
        ]
    },
    {
        path: '',
        redirectTo: 'Digifleet',
        pathMatch: 'full'
    }
];
