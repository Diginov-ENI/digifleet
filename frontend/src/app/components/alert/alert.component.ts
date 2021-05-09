import { Component, Input } from '@angular/core';


@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html',
  styleUrls: ['alert.component.scss'],
})
export class AlertComponent{
    @Input('type') typeInput: string;
    type:string
    constructor() {
    }

    hide(){

    }
    ngOnInit(){
        switch(this.typeInput){
            case 'danger':
            case 'warning':
            case 'info':
            case 'success':
                this.type = this.typeInput
                break;
            default:
                this.type = "danger";
        }
    }
}