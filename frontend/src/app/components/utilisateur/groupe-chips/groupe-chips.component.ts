
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GroupeBackendService } from 'src/app/backendservices/groupe.backendservice';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { Groupe } from 'src/app/models/groupe';
import { ToastHelperComponent } from '../../toast-message/toast-message.component';

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'groupe-chips',
  templateUrl: 'groupe-chips.component.html',
  styleUrls: ['groupe-chips.component.scss'],
})
export class GroupeChips implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  groupeCtrl = new FormControl();


  filteredGroupes: Observable<Groupe[]>;
  allGroupes: Groupe[] = [];
  selectedGroupes: Groupe[] = [];
  formControl = new FormControl();

  @Input() disabled: boolean = false;
  @ViewChild('groupeInput') groupeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(
    private _groupeBackendService: GroupeBackendService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {

    this._groupeBackendService.getGroupes().subscribe((response => {
      if (response.IsSuccess) {
        response.Data.map(groupe => this.allGroupes.push(new Groupe(groupe)))
        this.filteredGroupes = this.groupeCtrl.valueChanges.pipe(
          startWith(null),
          map((groupe: string | null) => this._filter(groupe)));
      } else {
        this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, response.LibErreur));
      }
    }));

  }
  public setSelectedGroupes(groupes) {
    this.selectedGroupes = groupes;
    this.groupeCtrl.setValue("");
  }
  public getSelectedGroupes() {
    return this.selectedGroupes;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    var results = this._filter(value);
    // Add our groupe
    if (results.length == 1 && this.optionValid(results[0])) {
      this.selectedGroupes.push(results[0]);
      // Reset the input value
      if (input && this.optionValid(results[0])) {
        input.value = '';
      }
    }



    this.groupeCtrl.setValue(null);
  }

  remove(groupe: Groupe): void {
    const index = this.selectedGroupes.indexOf(groupe);

    if (index >= 0) {
      this.selectedGroupes.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.optionValid(event.option.value)) {
      this.selectedGroupes.push(event.option.value);
      this.groupeInput.nativeElement.value = '';
      this.groupeCtrl.setValue(null);
    }
  }
  isSelectedGroupe(id) {
    var result = false;
    for (let groupe of this.selectedGroupes) {
      if (groupe.Id === id) {
        result = true;
      }
    }
    return result;
  }
  optionValid(option) {
    return this.allGroupes.includes(option) && !this.selectedGroupes.includes(option)
  }
  private _filter(value: string | Groupe): Groupe[] {

    const filterValue = value != null ? (typeof value == "string" ? value.toLowerCase() : value.Name) : "";

    var groupes = this.allGroupes.filter(groupe => {
      var search = filterValue.length > 0 ? (
        groupe.Name.toLowerCase().indexOf(filterValue) === 0
      ) : true;
      return (
        search
        && !this.isSelectedGroupe(groupe.Id)
      )
    });
    return groupes
  }
}