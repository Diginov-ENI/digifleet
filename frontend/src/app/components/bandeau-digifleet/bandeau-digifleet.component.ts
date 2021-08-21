import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur';

@Component({
    selector: 'bandeau-digifleet',
    templateUrl: 'bandeau-digifleet.component.html',
    styleUrls: ['bandeau-digifleet.component.scss'],
})
export class BandeauDigifleetComponent {
    public user: Utilisateur = null;
    constructor(private authService: AuthService,
        private router: Router){
            this.authService.getUser().subscribe(user=>this.user = user);
        }
    logout() {
        this.authService.logout();
        this.router.navigate(['/connexion'])
    }
}
