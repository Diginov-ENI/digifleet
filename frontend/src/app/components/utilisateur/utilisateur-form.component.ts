import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'utilisateur-form',
  templateUrl: 'utilisateur-form.component.html',
})

export class UtilisateurFormComponent implements OnInit {
  utilisateur: Utilisateur;
  form;

  ProfilsUtilisateur = [{
    id: 1,
    valeur: 'Tous les droits'
  },
  {
    id: 2,
    valeur: 'Back office'
  }
  ]

  constructor(private _utilisateurBackendService: UtilisateurBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {
    const utilisateurId = this.route.snapshot.paramMap.get('id');
    if (utilisateurId)
      this.chargerUtilisateur(utilisateurId);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Id: [''],
      Username: ['', Validators.required],
      Email: ['', [Validators.email, Validators.required]],
      Nom: [''],
      Prenom: [''],
      Groups: ['']
    });

    this.form.controls.Username.updateValueAndValidity();
    this.form.controls.Username.setValidators([Validators.required,
    this.noWhitespaceValidator()]);
    // unique(this.appelBack.utilisateurs$.value, ['LibLoginUse'], this.item.IdUse, ['IdUse'])]);
    // ToDo validateur unique 

    this.form.controls.Prenom.setValidators([Validators.required,
    this.noWhitespaceStartEndValidator()]);

    this.form.controls.Nom.setValidators([Validators.required,
    this.noWhitespaceStartEndValidator()]);
  }

  sauver() {
    this.utilisateur = new Utilisateur(this.form.value);

    // ToDo factoriser le passage des champ vide à undefined
    if (!this.utilisateur.Id) {
      this.utilisateur.Id = undefined;
      this.utilisateur.Groups = undefined;
      this._utilisateurBackendService.addUtilisateur(this.utilisateur).subscribe(res => {
        console.log(res);
      });
    } else {
      let object:object = {
        'Id' : this.utilisateur.Id,
        'Username' : this.utilisateur.Username,
        'Email' : this.utilisateur.Email,
        'Nom' : this.utilisateur.Nom,
        'Prenom' : this.utilisateur.Prenom
      }

      this._utilisateurBackendService.updateUtilisateur(object).subscribe(res => {
        this.authService.getUser().pipe(first()).subscribe(user=>{
          if(res.Id === user.Id){
            this.authService.refreshUserData();
          }
        });
        console.log(res);
      });
      // ToDo retour liste des utilisateurs
    }
  }

  chargerUtilisateur(id) {
    this._utilisateurBackendService.getUtilisateur(id).subscribe(res => {
      this.utilisateur = new Utilisateur();
      this.utilisateur = res;
      this.itemToForm(this.utilisateur);
    });
  }

  itemToForm(utilisateur: Utilisateur){
    this.form.controls.Id.setValue(utilisateur.Id);
    this.form.controls.Username.setValue(utilisateur.Username);
    this.form.controls.Email.setValue(utilisateur.Email);
    this.form.controls.Nom.setValue(utilisateur.Nom);
    this.form.controls.Prenom.setValue(utilisateur.Prenom);
  }

  public noWhitespaceValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const isOnlyWhitespace = c.value ? c.value.includes(' ') : false;
      const isValid = !isOnlyWhitespace;
      return isValid ? null : { onlyWhitespace: true };
    };
  }

  public noWhitespaceStartEndValidator(): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const isOnlyWhitespace = c.value ? c.value[0] === ' ' || c.value[c.value.length - 1] === ' ' : false;
      const isValid = !isOnlyWhitespace;
      return isValid ? null : { WhitespaceStartOrEnd: true };
    };
  }
}
