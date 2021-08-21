import { Component, Inject } from '@angular/core';
import {
  MatSnackBarConfig,
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { DigiUtils } from 'src/app/models/digiutils';

/**
 * @title Snack-bar Material
 */
@Component({
  selector: 'toast-message',
  templateUrl: 'toast-message.component.html',
})
export class ToastHelperComponent {
  DigiUtils = Object.assign({}, DigiUtils);

  constructor(
    public snackBarRef: MatSnackBarRef<ToastHelperComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { type: string, libMessageToast: string },
    @Inject(MAT_SNACK_BAR_DEFAULT_OPTIONS) public config: MatSnackBarConfig,
  ) { }
}
