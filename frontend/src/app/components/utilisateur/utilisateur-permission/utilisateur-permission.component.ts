import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { UtilisateurBackendService } from "src/app/backendservices/utilisateur.backendservice";
import { Utilisateur } from "src/app/models/utilisateur";
import { AuthService } from "src/app/services/auth.service";
import { PermissionFormComponent } from "../../permission/permission-form.component";

@Component({
    selector: 'utilisateur-permission',
    templateUrl: 'utilisateur-permission.component.html',
})

export class UtilisateurPermissionComponent implements OnInit {
    utilisateur: Utilisateur;
    @ViewChild('permissionFrom') permissionFrom: PermissionFormComponent;
    constructor(
        private _utilisateurBackendService: UtilisateurBackendService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
    ) {

    }

    ngOnInit() {
        const utilisateurId = this.route.snapshot.paramMap.get('id');
        if (utilisateurId)
            this.chargerUtilisateur(utilisateurId);
    }
    chargerUtilisateur(id) {
        this._utilisateurBackendService.getUtilisateur(id).subscribe(res => {
            this.utilisateur = new Utilisateur(res);
            this.loadChecked();
        });
    }
    loadChecked() {
        this.permissionFrom.loadChecked();
    }
    sauver() {
        var object= {
            "DirectUserPermissions" : this.permissionFrom.getCheckedPermissions(),
            "Id" : this.utilisateur.Id
        }
        this._utilisateurBackendService.updateUtilisateur(object).subscribe(res => {
            this.authService.getUser().pipe(first()).subscribe(user => {
                if (res.Id === user.Id) {
                    this.authService.refreshUserData();
                }
                this.router.navigate(['Digifleet/liste-utilisateur']);
            });
        });
    }
}