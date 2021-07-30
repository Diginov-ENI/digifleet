import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupeBackendService } from 'src/app/backendservices/groupe.backendservice';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { Groupe } from 'src/app/models/groupe';
import { PermissionType } from 'src/app/models/permission_type';
import { Utilisateur } from 'src/app/models/utilisateur';
import { PermissionFormComponent } from '../permission/permission-form.component';
import { PermissionCheckbox } from '../permission/permission-type.component';
import { ToastHelperComponent } from '../toast-message/toast-message.component';
import { UtilisateurChips } from './utilisateur-chips/utilisateur-chips.component';

@Component({
  selector: 'groupe-form',
  styleUrls: ['groupe-form.component.scss'],
  templateUrl: 'groupe-form.component.html'
})
export class GroupeFormComponent implements OnInit, AfterViewChecked {
  form;
  groupe: Groupe;
  firtView = true;

  @ViewChild('utilisateursChips') utilisateursChips: UtilisateurChips;
  @ViewChild('permissionFrom') permissionFrom: PermissionFormComponent;

  constructor(
    private _groupeBackendService: GroupeBackendService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Id: [''],
      Name: ['', Validators.required],
    });

    this.form.controls.Name.updateValueAndValidity();
    this.form.controls.Name.setValidators([Validators.required]);
  }

  ngAfterViewChecked() {
    if (this.firtView) {
      this.firtView = false;
      const groupeId = this.route.snapshot.paramMap.get('id');

      if (groupeId) {
        this.chargerGroupe(groupeId);
      } else {
        this.loadChecked()
      }
    }
  }

  loadChecked() {
    this.permissionFrom.loadChecked();
  }

  sauver() {
    this.groupe = new Groupe(this.form.value);
    this.groupe.Permissions = this.getCheckedPermissions();
    this.groupe.Utilisateurs = this.getSelectedUtilisateurs();
    if (!this.groupe.Id) {
      this.groupe.Id = undefined;
      this._groupeBackendService.addGroupe(this.groupe).subscribe(res => {
        if (res.IsSuccess) {
          this.router.navigate(['Digifleet/liste-groupe']);
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Groupe ajouté avec succès.'));
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    } else {
      this._groupeBackendService.updateGroupe(this.groupe).subscribe(res => {
        if (res.IsSuccess) {
          this.router.navigate(['Digifleet/liste-groupe']);
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(false, 'Groupe modifié avec succès.'));
        } else {
          this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
        }
      });
    }
  }

  getSelectedUtilisateurs(): Utilisateur[] {
    return this.utilisateursChips.getSelectedUtilisateurs();
  }

  chargerGroupe(id) {
    this._groupeBackendService.getGroupe(id).subscribe(res => {
      if (res.IsSuccess) {
        this.groupe = new Groupe(res.Data);
        this.itemToForm(this.groupe);
        this.loadChecked();
        this.utilisateursChips.setSelectedUtilisateurs(this.groupe.Utilisateurs)
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
      }
    });
  }

  itemToForm(groupe: Groupe) {
    this.form.controls.Id.setValue(groupe.Id);
    this.form.controls.Name.setValue(groupe.Name);
  }

  public noWhitespaceValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const isOnlyWhitespace = c.value ? c.value.includes(' ') : false;
      const isValid = !isOnlyWhitespace;
      return isValid ? null : { onlyWhitespace: true };
    };
  }

  public noWhitespaceStartEndValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const isOnlyWhitespace = c.value ? c.value[0] === ' ' || c.value[c.value.length - 1] === ' ' : false;
      const isValid = !isOnlyWhitespace;
      return isValid ? null : { WhitespaceStartOrEnd: true };
    };
  }

  getCheckedPermissions() {
    return this.permissionFrom.getCheckedPermissions();
  }
}

export interface PermissionTypeCheckbox {
  data: PermissionType;
  completed: boolean;
  permissions?: PermissionCheckbox[];
}
