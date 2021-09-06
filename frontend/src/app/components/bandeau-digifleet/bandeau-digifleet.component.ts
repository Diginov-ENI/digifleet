import { Component, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'bandeau-digifleet',
    templateUrl: 'bandeau-digifleet.component.html',
    styleUrls: ['bandeau-digifleet.component.scss'],
})
export class BandeauDigifleetComponent implements OnDestroy {
    public connectedUser: Utilisateur = null;
    private _destroy$ = new Subject<void>();
    isResizeNeeded: boolean = false;
    public get connectedUserName(): string {
        if (this.connectedUser?.Nom || this.connectedUser?.Prenom) {
            let username = '';
            if (this.isResizeNeeded) {
                if (this.connectedUser.Prenom) {
                    username = this.connectedUser.Prenom.charAt(0)?.toUpperCase();
                }
                if (this.connectedUser.Nom) {
                    username += this.connectedUser.Nom.charAt(0)?.toUpperCase();
                }
            } else {
                if (this.connectedUser.Prenom) {
                    username = this.connectedUser.Prenom.charAt(0)?.toUpperCase() + this.connectedUser.Prenom.slice(1) + ' ';
                }
                if (this.connectedUser.Nom) {
                    username += this.connectedUser.Nom.toUpperCase();
                }
            }
            return username;
        }
        return null;
    }

    constructor(private _authService: AuthService,
        private _router: Router,
    ) {
        this._authService.utilisateurConnecte$
            .pipe(takeUntil(this._destroy$), filter(user => (user !== null && user !== undefined)))
            .subscribe(utilisateur => this.connectedUser = utilisateur);
    }

    ngOnDestroy() {
        this._destroy$.next();
    }

    logout() {
        this._authService.logout();
        this._router.navigate(['/connexion'])
    }

    @HostListener('window:resize', ['$event'])
    private onResize(event?) {
        if (window.innerWidth < 600)
            this.isResizeNeeded = true;
        else
            this.isResizeNeeded = false;
    }
}
