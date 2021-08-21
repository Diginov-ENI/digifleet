
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { Utilisateur } from 'src/app/models/utilisateur';
import { ToastHelperComponent } from '../../toast-message/toast-message.component';

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'passager-chips',
  templateUrl: 'passager-chips.component.html',
  styleUrls: ['passager-chips.component.scss'],
})
export class PassagerChips implements OnInit {
  @Input() typeEmprunt = '';
  isDisabled = false;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  passagerCtrl = new FormControl();

  filteredUtilisateurs: Observable<Utilisateur[]>;
  utilisateurs: Utilisateur[] = [];
  passagers: Utilisateur[] = [];
  formControl = new FormControl();

  @ViewChild('passagerInput') passagerInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private _utilisateurBackendService: UtilisateurBackendService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this._utilisateurBackendService.getUtilisateurs().subscribe((response => {
      if (response.IsSuccess) {
        response.Data.map(utilisateur => this.utilisateurs.push(new Utilisateur(utilisateur)))
        this.filteredUtilisateurs = this.passagerCtrl.valueChanges.pipe(
          startWith(null),
          map((utilisateur: string | null) => this._filter(utilisateur)));
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    }));
  }

  ngOnChanges(): void {
    if(this.typeEmprunt == 'F'){
      this.isDisabled = true;
      this.resetPassagers();
    }else{
      this.isDisabled = false;
    }
  }

  public setPassagers(passagers) {
    this.passagers = passagers;
    this.passagerCtrl.setValue("");
  }

  public resetPassagers() {
    this.passagers = [];
    this.passagerCtrl.setValue("");
  }

  public getPassagers() {
    return this.passagers;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var results = this._filter(value);
    // Add our passager
    if (results.length == 1 && this.optionValid(results[0])) {
      this.passagers.push(results[0]);
      // Reset the input value
      if (input && this.optionValid(results[0])) {
        input.value = '';
      }
    }
    this.passagerCtrl.setValue(null);
  }

  remove(utilisateur: Utilisateur): void {
    const index = this.passagers.indexOf(utilisateur);
    if (index >= 0) {
      this.passagers.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.optionValid(event.option.value)) {
      this.passagers.push(event.option.value);
      this.passagerInput.nativeElement.value = '';
      this.passagerCtrl.setValue(null);
    }
  }
  isSelectedPassager(id) {
    var result = false;
    for (let passager of this.passagers) {
      if (passager.Id === id) {
        result = true;
      }
    }
    return result;
  }
  optionValid(option) {
    return this.utilisateurs.includes(option) && !this.passagers.includes(option)
  }
  private _filter(value: string | Utilisateur): Utilisateur[] {
    const filterValue = value != null ? (typeof value == "string" ? value.toLowerCase() : value.Nom) : "";

    var utilisateurs = this.utilisateurs.filter(utilisateur => {
      var search = filterValue.length > 0 ? (
        utilisateur.Nom.toLowerCase().indexOf(filterValue) === 0 ||
        utilisateur.Prenom.toLowerCase().indexOf(filterValue) === 0
      ) : true;
      
      return (
        search
        && !this.isSelectedPassager(utilisateur.Id)
      )
    });
    return utilisateurs
  }
}