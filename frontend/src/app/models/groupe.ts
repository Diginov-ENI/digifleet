import { Permission } from './permission';
import { Utilisateur } from './utilisateur';

export class Groupe{
    public Id: number;
    public Name: string;
    public Permissions: Permission[];
    public Utilisateurs: Utilisateur[] = [];

    public constructor(init?: Partial<Groupe>) {
        Object.assign(this, init);
        this.Utilisateurs = [];
        if(typeof init !== 'undefined' && init !== null){
            if(typeof init.Utilisateurs !== 'undefined'){
                for(let user of init.Utilisateurs){
                    delete user.Groups;
                    let obj =new Utilisateur(user);
                    this.Utilisateurs.push(obj)
                }
            }
          
        }
    }
    public hasPermissionByCodeName(codename:string) {
        return (this.Permissions.map(perm=> perm.Codename).includes(codename));
    }
    public hasDirectPermissionByCodeName(codename:string) {
        return this.hasPermissionByCodeName(codename);
    }
}
