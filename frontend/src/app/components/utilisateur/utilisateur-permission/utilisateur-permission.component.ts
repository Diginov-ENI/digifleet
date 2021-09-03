import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, first, takeUntil } from "rxjs/operators";
import { UtilisateurBackendService } from "src/app/backendservices/utilisateur.backendservice";
import { Utilisateur } from "src/app/models/utilisateur";
import { AuthService } from "src/app/services/auth.service";
import { PermissionFormComponent } from "../../permission/permission-form.component";

@Component({
    selector: 'utilisateur-permission',
    templateUrl: 'utilisateur-permission.component.html',
})

export class UtilisateurPermissionComponent implements OnInit, OnDestroy {
    @ViewChild('permissionFrom') permissionFrom: PermissionFormComponent;

    private _destroy$ = new Subject<void>();
    private _connectedUser: Utilisateur;

    utilisateur: Utilisateur;

    constructor(
        private _utilisateurBackendService: UtilisateurBackendService,
        private router: Router,
        private route: ActivatedRoute,
        private _authService: AuthService,
    ) {

    }

    ngOnInit() {
        const utilisateurId = this.route.snapshot.paramMap.get('id');
        if (utilisateurId)
            this.chargerUtilisateur(utilisateurId);

        this._authService.utilisateurConnecte$
            .pipe(takeUntil(this._destroy$), filter(user => (user !== null && user !== undefined)))
            .subscribe(utilisateur => this._connectedUser = utilisateur);
    }

    ngOnDestroy() {
        this._destroy$.next();
    }

    chargerUtilisateur(id) {
        this._utilisateurBackendService.getUtilisateur(id).subscribe(res => {
            if (res.IsSuccess) {
                this.utilisateur = new Utilisateur(res.Data);
                this.loadChecked();
            }
        });
    }

    loadChecked() {
        this.permissionFrom.loadChecked();
    }

    sauver() {
        var object = {
            "DirectUserPermissions": this.permissionFrom.getCheckedPermissions(),
            "Id": this.utilisateur.Id
        }

        this._utilisateurBackendService.updateUtilisateur(object).subscribe(res => {
            if (res.IsSuccess) {
                if (res.Data.Id === this._connectedUser.Id) {
                    this._authService.refreshUserData();
                }
                this.router.navigate(['Digifleet/liste-utilisateur']);
            }
        });
    }
}
