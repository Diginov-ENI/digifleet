
import { group } from '@angular/animations';
import { AfterViewChecked, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupeBackendService } from 'src/app/backendservices/groupe.backendservice';
import { PermissionTypeBackendService } from 'src/app/backendservices/permissiontype.backendservice';
import { Groupe } from 'src/app/models/groupe';
import { Permission } from 'src/app/models/permission';
import { PermissionType } from 'src/app/models/permission_type';
import { Utilisateur } from 'src/app/models/utilisateur';
import { PermissionFormComponent } from '../permission/permission-form.component';
import { PermissionCheckbox, PermissionTypeComponent } from '../permission/permission-type.component';
import { UtilisateurChips } from './utilisateur-chips/utilisateur-chips.component';

@Component({
  selector: 'groupe-form',
  styleUrls: ['groupe-form.component.scss'],
  templateUrl: 'groupe-form.component.html'
})
export class GroupeFormComponent implements OnInit,AfterViewChecked  {
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
  ) {



  }

  ngOnInit() {
   
    
    this.form = this.formBuilder.group({
      Id: [''],
      Name: ['', Validators.required],
    });


    this.form.controls.Name.updateValueAndValidity();
    this.form.controls.Name.setValidators([Validators.required]);

  }
  ngAfterViewChecked(){ 
    if(this.firtView){
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
        this.router.navigate(['Digifleet/liste-groupe']);
      });
    } else {
      this._groupeBackendService.updateGroupe(this.groupe).subscribe(res => {
        this.router.navigate(['Digifleet/liste-groupe']);
      });
    }

  }

  getSelectedUtilisateurs(): Utilisateur[] {
    return this.utilisateursChips.getSelectedUtilisateurs();
  }
  chargerGroupe(id) {
    this._groupeBackendService.getGroupe(id).subscribe(res => {
      this.groupe = new Groupe(res);
      this.itemToForm(this.groupe);
      this.loadChecked();
      this.utilisateursChips.setSelectedUtilisateurs(this.groupe.Utilisateurs)
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
