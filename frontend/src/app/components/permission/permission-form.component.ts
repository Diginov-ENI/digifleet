import { Component, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { PermissionTypeBackendService } from "src/app/backendservices/permissiontype.backendservice";
import { Groupe } from "src/app/models/groupe";
import { Permission } from "src/app/models/permission";
import { PermissionType } from "src/app/models/permission_type";
import { Utilisateur } from "src/app/models/utilisateur";
import { PermissionTypeCheckbox } from "../groupe/groupe-form.component";
import { PermissionCheckbox, PermissionTypeComponent } from "./permission-type.component";



@Component({
    selector: 'permission-form',
    styleUrls: ['permission-form.component.scss'],
    templateUrl: 'permission-form.component.html'
})
export class PermissionFormComponent implements OnInit {

    types: PermissionType[]
    typesCheckbox: PermissionTypeCheckbox[];
    allPermissionsComplete: boolean = false;
    @Input() parent: Groupe | Utilisateur;
    @ViewChildren('permissionType') typesComponents: QueryList<PermissionTypeComponent>;

    constructor(
        private _permissionTypeBackendService: PermissionTypeBackendService,

    ) {
    }
    ngOnInit(): void {
        this.loadChecked()
    }
    loadChecked() {
        this._permissionTypeBackendService.getPermissionTypes().subscribe((response => {

            this.types = response;
            this.typesCheckbox = []
            this.types.forEach(t => {
                var perms: PermissionCheckbox[] = [];
                t.Permissions.forEach(p => {
                    perms.push({
                        data: p,
                        completed: this.parent && this.parent.hasDirectPermissionByCodeName(p.Codename)
                    })
                });
                this.typesCheckbox.push({
                    data: t,
                    completed: false,
                    permissions: perms
                })

            });
            this.verifyPermissions();
        }))
    }
    verifyPermissions(data = "") {
        var allChecked = true;
        this.typesComponents.forEach(t => {
            if (!t.isAllCompleted()) {
                allChecked = false;
            }

        });
        this.allPermissionsComplete = allChecked;
    }

    setAll(completed: boolean) {
        this.allPermissionsComplete = completed;

        this.typesCheckbox.forEach(t => {
            t.completed = completed;
            t.permissions.forEach(p => p.completed = completed);
        });

        this.typesComponents.forEach(t => {
            t.loadChecked();
        });
    }
    setAllType(id, completed: boolean) {
        this.typesCheckbox.forEach(t => {
            if (t.data.Id === id) {
                t.completed = completed;
                t.permissions.forEach(p => p.completed = completed);
            }
        });
    }
    setPermission(id, completed: boolean) {
        this.typesCheckbox.forEach(t => {
            t.permissions.forEach(p => {
                if (p.data.Id === id) {
                    p.completed = completed;
                }
            })

        });
    }
    getCheckedPermissions() {
        var perms: Permission[] = []
        this.typesComponents.forEach(t => {
            perms = perms.concat(t.getCheckedPermissions())

        });
        return perms;
    }

}