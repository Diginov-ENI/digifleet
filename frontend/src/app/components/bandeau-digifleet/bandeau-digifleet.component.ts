import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'bandeau-digifleet',
    templateUrl: 'bandeau-digifleet.component.html',
})
export class BandeauDigifleetComponent {
    constructor(private authService: AuthService,
        private router: Router){}
    logout() {
        this.authService.logout();
        this.router.navigate(['/connexion'])
    }
}