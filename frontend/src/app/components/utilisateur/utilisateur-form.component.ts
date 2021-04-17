import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurBackendService } from 'src/app/backendservices/utilisateur.backendservice';
import { Utilisateur } from 'src/app/models/utilisateur';

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
  },
  {
    id: 3,
    valeur: `Je ne sert qu'à l'affichage`
  }
  ]

  constructor(private _utilisateurBackendService: UtilisateurBackendService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
      MotDePasse: [''],
      Nom: [''],
      Prenom: [''],
      Groups: [''],
      UserPermissions: [''],
      IsActive: [''],
      IsSuperuser: [''],
      LastLogin: [''],
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

    this._utilisateurBackendService.addUtilisateur(this.utilisateur).subscribe(res => {
      console.log(res);
    });
  }

  chargerUtilisateur(id) {
    this._utilisateurBackendService.getUtilisateur(id).subscribe(res => {
      this.utilisateur = new Utilisateur();
      this.utilisateur = res;
    });
    // ToDo : s'assurer que le post fonctionne (notament la déserialization)
    // ToDo : transformer ne retour du get en formulaire
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
