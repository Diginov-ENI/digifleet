import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'vehicule-list',
  templateUrl: 'vehicule-list.component.html',
})

export class VehiculeListComponent implements OnInit{
  
  constructor(public matDialog: MatDialog) {}

  ngOnInit(){
  }


}
