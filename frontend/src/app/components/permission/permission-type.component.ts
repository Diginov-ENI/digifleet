import { EventEmitter } from "@angular/core";
import { Component, Input, OnInit, Output } from "@angular/core";
import { Permission } from "src/app/models/permission";


@Component({
    selector: 'permission-type',
    styleUrls: ['permission-type.component.scss'],
    templateUrl: 'permission-type.component.html'
})

export class PermissionTypeComponent implements OnInit {

    completed: boolean = false;
    loaded = false;
    @Input() name;
    @Input() type;
    @Output() permissionsUpdate = new EventEmitter();

    ngOnInit(): void {
        this.loadChecked();
    }
    loadChecked() {

        var allChecked = true;
        this.type.permissions.forEach(p => {
            if (!p.completed) {
                allChecked = false;
            }

        });
        this.completed = allChecked;

        this.permissionsUpdate.emit("update");
    }
    isAllCompleted() {
        return this.completed;
    }
    setAllType(completed: boolean) {
        this.type.completed = completed;
        this.type.permissions.forEach(p => p.completed = completed);
        this.loadChecked();
    }
    setPermission(id, completed: boolean) {

        this.type.permissions.forEach(p => {
            if (p.data.Id === id) {
                p.completed = completed;
            }
        });
        this.loadChecked();
    }
    getCheckedPermissions() {
        var perms: Permission[] = []

        this.type.permissions.forEach(p => {
            if (p.completed) {
                perms.push(p.data)
            }
        });
        return perms;
    }
}

export interface PermissionCheckbox {
    data: Permission;
    completed: boolean;
}