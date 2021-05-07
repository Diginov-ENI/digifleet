import { NodeWithI18n } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import {MatDialog} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'utilisateur-securite',
  templateUrl: 'utilisateur-securite.component.html',
})

export class UtilisateurSecuriteComponent implements OnInit{

  private passwordForm = new FormGroup({
    password: new FormControl(),
    passwordAgain: new FormControl()
  }); 
  private user:Utilisateur = null;
  constructor(private authService: AuthService,
    private _utilisateurBackendService: UtilisateurBackendService){
          this.authService.getUser().subscribe(user=>this.user = user);
      }

  ngOnInit(){
    
  }

  onFormPasswordChange(){
    let object:object = {
      'Id' : this.user.Id,
      'Password' :this.passwordForm.get('password').value,
    }
    this._utilisateurBackendService.updatePasswordUtilisateur(object).subscribe(res => {
      console.log(res);
    });
    this.clearPasswordForm();
  }
  
  clearPasswordForm(){
    
      this.passwordForm.setValue({password: '', passwordAgain: '' }); 

  }
}