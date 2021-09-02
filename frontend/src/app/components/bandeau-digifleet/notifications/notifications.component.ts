import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Utilisateur } from 'src/app/models/utilisateur';
import { NotificationBackendService } from 'src/app/backendservices/notification.backendservice';
import { ToastHelperComponent } from '../../toast-message/toast-message.component';
import { ConfigMatsnackbar } from 'src/app/models/digiutils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notification } from 'src/app/models/notification';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'notifications',
    templateUrl: 'notifications.component.html',
    styleUrls: ['notifications.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy{
  
    EMPRUNT_ROUTE = '/Digifleet/liste-emprunt';
    public user: Utilisateur = null;
    public notifications:Notification[]= [];
    private _snackBar: MatSnackBar;
    public opened = false;
    subscription: Subscription;
    @ViewChild('notificationsBlock', { static: false }) insideElement;
    constructor(
        private authService: AuthService,
        private _notificationsBackendservice:NotificationBackendService,
        private router: Router
        ){

            this.authService.getUser().subscribe(user=>this.user = user);
            this.loadNotifications()

            const source = interval(30000);
            this.subscription = source.subscribe(val => this.loadNotifications());
        }

    loadNotifications(){
        let tmpnotifications=[]
        this._notificationsBackendservice.getNotifications().subscribe(res => {
            if (res.IsSuccess) {
             res.Data.forEach(notification => {
                 let notif = new Notification(notification);
                 tmpnotifications.push(notif)
             });
             this.notifications = tmpnotifications;
            } else {
              this._snackBar.openFromComponent(ToastHelperComponent, ConfigMatsnackbar.setToast(true, res.LibErreur));
            }
          });
    }

    readNotification(id){
      this._notificationsBackendservice.setReadNotification(id).subscribe(res => {
      this.loadNotifications();
      });
    }
    toggleNotifications(){
        if(this.opened){
            this.opened = false;
        }else{
            this.opened = true;
        }
    }
    closeNotifications(){
        this.opened = false;
    }
    openNotification(idEmprunt){

      this.router.navigate([this.EMPRUNT_ROUTE]).then(() =>
      {
        
        let self = this;
        setTimeout(function(){
          let emprunt =  document.querySelector("#emprunt"+idEmprunt);
          self.scrollToElement(emprunt)
        },1000);
      })
    }
    scrollToElement($element): void {
      console.log($element)
      $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    }

    public ngOnInit() {
        this.onDocumentClick = this.onDocumentClick.bind(this);
        document.addEventListener('click', this.onDocumentClick);
      }
    
      public ngOnDestroy() {
        document.removeEventListener('click', this.onDocumentClick);
      }
    
      protected onDocumentClick(event: MouseEvent) {
        if (this.insideElement.nativeElement.contains(event.target)) {
          return;
        }
        this.closeNotifications()
      }
}
