import { Groupe } from './groupe';
import { Permission } from './permission';

export class Utilisateur{
    public Id: number;
    public Username: string;
    public Email: string;
    public MotDePasse: string;
    public Nom: string;
    public Prenom: string;
    public Groups: Groupe[] = [];
    public UserPermissions: Permission[];
    public DirectUserPermissions: Permission[];
    public IsActive: boolean;
    public IsSuperuser: boolean;
    public LastLogin: Date;
    public IsPasswordToChange: boolean;

    public constructor(init?: Partial<Utilisateur>) {3
        Object.assign(this, init);
        this.UserPermissions = [];
        this.DirectUserPermissions = [];
        this.Groups = [];
        if(typeof init !== 'undefined' && init !== null){
            if(typeof init.UserPermissions != 'undefined'){
                for(let perm of init.UserPermissions){
                    let obj = new Permission(perm);
                    this.UserPermissions.push(obj)
                }
            }
            if(typeof init.DirectUserPermissions != 'undefined'){
                for(let perm of init.DirectUserPermissions){
                    let obj = new Permission(perm);
                    this.DirectUserPermissions.push(obj)
                }
            }
            if(typeof init.Groups !== 'undefined'){
                for(let grp of init.Groups){
                    delete grp.Utilisateurs;
                    let obj = new Groupe(grp);
                    this.Groups.push(obj)
                }
            }
        }
       
       
    }
    public isInGroupe(id:number){
        return this.Groups.map(grp=> grp.Id).includes(id);
    }
    public hasPermissionByCodeName(codename:string) {
        if(typeof this.UserPermissions != 'undefined'){
            return (this.IsSuperuser || this.UserPermissions.map(perm=> perm.Codename).includes(codename));
        }else{
            return (this.IsSuperuser);
        }
    }
    public hasDirectPermissionByCodeName(codename:string) {
        if(typeof this.DirectUserPermissions != 'undefined'){
            return (this.DirectUserPermissions.map(perm=> perm.Codename).includes(codename));
        }else{
            return false;
        }
    }
}
