import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmpruntBackendService } from 'src/app/backendservices/emprunt.backendservice';
import { SiteBackendService } from 'src/app/backendservices/site.backendservice';
import { Emprunt } from 'src/app/models/emprunt';
import { Site } from 'src/app/models/site';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastHelperComponent } from '../../../toast-message/toast-message.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';

@Component({
    selector: 'emprunt-filters',
    templateUrl: 'emprunt-filters.component.html'
  })

  export class EmpruntFilters implements OnInit {
    @Output() newEmpruntsEvent = new EventEmitter<Emprunt[]>();
    @Input() connectedUser;
    sites: Site[];
    format: string = 'YYYY-MM-DD[T]HH:mm:ss[Z]';
    form;
  
    constructor(
        private _empruntBackendService: EmpruntBackendService,
        private _siteBackendService: SiteBackendService,
        private formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
    ) {}
  
    ngOnInit() {
        this.getSites();

        this.form = this.formBuilder.group({
            DateDebut: [''],
            DateFin: [''],
            Site: [''],
            IsCloturee: [''],
          });
    }

    getSites() {
        this._siteBackendService.getSites().subscribe(response => {
          this.sites = response.Data;
        })
      }

    filtrer(){
      let dateDebut = this.form.controls.DateDebut.value ? this.form.controls.DateDebut.value.format(this.format) : null;
      let dateFin = this.form.controls.DateFin.value ? this.form.controls.DateFin.value.format(this.format) : null;
      let siteId = this.form.controls.Site.value ? this.form.controls.Site.value : null;
      let isCloturee = this.form.controls.IsCloturee.value ? this.form.controls.IsCloturee.value : false;

      if(this.connectedUser.hasPermissionByCodeName('emprunt_list')){
        this._empruntBackendService.getEmprunts(dateDebut, dateFin, siteId, isCloturee).subscribe(res => {
          if (res.IsSuccess) {
            this.newEmpruntsEvent.emit(res.Data);
          } else {
            this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
          }
        });
      }else{
        this._empruntBackendService.getEmpruntsByOwner(this.connectedUser.Id, dateDebut, dateFin, siteId, isCloturee).subscribe(res => {
          if (res.IsSuccess) {
            this.newEmpruntsEvent.emit(res.Data);
          } else {
            this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
          }
        });
      }
      
     
    }
  }