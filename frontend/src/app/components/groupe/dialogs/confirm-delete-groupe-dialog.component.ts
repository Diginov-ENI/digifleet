import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Groupe } from "src/app/models/groupe";

@Component({
    selector: 'confirm-delete-groupe-dialog',
    templateUrl: './confirm-delete-groupe-dialog.component.html',
  })
  export class ConfirmDeleteGroupeDialogComponent {
    constructor(
      public dialogRef: MatDialogRef<ConfirmDeleteGroupeDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  }
  
  export interface DialogData {
    groupe: Groupe;
  }
  