export class Utilisateur{
    public Id?: number;
    public Email?: string;
    public Username?: string;
    public Nom?: string;
    public Prenom?: string;
    public IsActive?: boolean;
    public LastLogin?: Date;
    public IsSuperuser?: boolean;
    public Groups?: string[];
    public UserPermissions?: string[];

    public constructor(init?: Partial<Utilisateur>) {
        Object.assign(this, init);
      }
}