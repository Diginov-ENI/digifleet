import { Permission } from "./permission";

export class PermissionType{
    public Id: number;
    public Name: string;
    public Permissions:Permission[];

    public constructor(init?: Partial<PermissionType>) {
        Object.assign(this, init);
        this.Permissions = [];
        for(let perm of init.Permissions){
            let obj =new Permission(perm);
            this.Permissions.push(obj)
        }
    }
}
