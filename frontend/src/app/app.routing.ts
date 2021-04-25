import { RouterModule, Routes } from '@angular/router';
import { UtilisateurListComponent } from './components/utilisateur/utilisateur-list.component';
import { VehiculeComponent } from './components/vehicule/vehicule.component';
import { DigifleetHomeComponent } from './digifleet-home.component';
import {ConnexionFormComponent} from './components/connexion/connexion-form.component';
import { AuthGuard } from './services/authGuard.service';

// WIP - la gestion des routes est susceptible de changer, essayez d'ajouter proprement vos routes sur une ligne pour éviter les merge conflicts
export const APP_ROUTING = RouterModule.forRoot([
    { path: 'Digifleet', component: DigifleetHomeComponent, outlet: 'Digifleet', canActivate:[AuthGuard]},
    { path: 'connexion', component: ConnexionFormComponent }, // ToDo remplacer DigifleetHomeComponent par le component de connexion
], { scrollPositionRestoration: 'enabled' });

export const DETAILS_ROUTES: Routes = [
    {
        path: 'Digifleet',
        component: DigifleetHomeComponent,
        children: [
            { path: 'liste-vehicule', component: VehiculeComponent },
            { path: 'liste-utilisateur', component: UtilisateurFormComponent },  // ajouter /:id dans le path
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
