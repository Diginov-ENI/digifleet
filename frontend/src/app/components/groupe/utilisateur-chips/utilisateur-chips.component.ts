
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'utilisateur-chips',
  templateUrl: 'utilisateur-chips.component.html',
  styleUrls: ['utilisateur-chips.component.scss'],
})
export class UtilisateurChips implements OnInit{
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    userCtrl = new FormControl();
    

    filteredUsers:Observable<Utilisateur[]>;
    allUsers: Utilisateur[] = [];
    selectedUsers: Utilisateur[] = [];
    
    @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
  
    constructor(
        private _utilisateurBackendService: UtilisateurBackendService,
      ) {
      
    }
  ngOnInit(): void {
    this._utilisateurBackendService.getUtilisateurs().subscribe((response => {
      response.Data.map( user => this.allUsers.push(new Utilisateur(user)))
      this.filteredUsers = this.userCtrl.valueChanges.pipe(
        startWith(null),
        map((user: string | null) => this._filter(user)));
    }))
    
  }
  public setSelectedUtilisateurs(utilisateurs){
    this.selectedUsers = utilisateurs;
    this.userCtrl.setValue("");
  }
  public getSelectedUtilisateurs(){
    return this.selectedUsers;
  }
    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      var results = this._filter(value);
      // Add our user
      if (results.length == 1 && this.optionValid(results[0])) {
        this.selectedUsers.push(results[0]);
        // Reset the input value
        if (input && this.optionValid(results[0])) {
          input.value = '';
        }
      }
      this.userCtrl.setValue(null);
    }
  
    remove(user: Utilisateur): void {
      const index = this.selectedUsers.indexOf(user);
  
      if (index >= 0) {
        this.selectedUsers.splice(index, 1);
      }
    }
  
    selected(event: MatAutocompleteSelectedEvent): void {
      if(this.optionValid(event.option.value)){
        this.selectedUsers.push(event.option.value);
        this.userInput.nativeElement.value = '';
        this.userCtrl.setValue(null);
      }
    }
    
    isSelectedUser(id){
      var result = false;
      for(let user of this.selectedUsers){
        if(user.Id === id){
          result = true;
        }
      }
      return result;
    }
    optionValid(option){
      return this.allUsers.includes(option) && !this.selectedUsers.includes(option)
    }
    private _filter(value: string | Utilisateur): Utilisateur[] {
      const filterValue = value != null ?(typeof value == "string" ? value.toLowerCase():  value.Email ): "";
      var users =  this.allUsers.filter(user => {
        var search = filterValue.length > 0?  (
          user.Nom.toLowerCase().indexOf(filterValue) === 0
        || user.Prenom.toLowerCase().indexOf(filterValue) === 0
        || user.Username.toLowerCase().indexOf(filterValue) === 0
        || user.Email.toLowerCase().indexOf(filterValue) === 0
        ): true;
        return (
          search
          && !this.isSelectedUser(user.Id)
          )
      });
      return users
    }
  }