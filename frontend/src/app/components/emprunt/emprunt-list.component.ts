import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { MatDialog } from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'emprunt-list',
  templateUrl: 'emprunt-list.component.html',
  styleUrls: ['emprunt-list.scss'],
})

export class EmpruntListComponent implements OnInit {

  emprunts: Emprunt[];
  emprunt: Emprunt;

  constructor(private _empruntBackendService: EmpruntBackendService, public matDialog: MatDialog) { }

  ngOnInit() {
    this.getEmprunts();
  }

  getEmprunts() {
    this._empruntBackendService.getEmprunts().subscribe((response => {
      this.emprunts = response;
    }))
  }

  getEmpruntById(id) {
    this._empruntBackendService.getEmprunt(id).subscribe((response => {
      this.emprunt = response;
    }))
  }

  deleteEmprunt(id) {
    this._empruntBackendService.deleteEmprunt(id).subscribe(() => {
      this.getEmprunts();
    })
  }
}

@Component({
  selector: 'stepper-statut',
  templateUrl: './components/stepper-statut.html',
})
export class StepperStatutComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}

export interface DialogData {
  emprunt: Emprunt;
}
