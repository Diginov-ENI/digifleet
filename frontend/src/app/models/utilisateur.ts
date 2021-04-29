export class Utilisateur{
    public Id: number;
    public Username: string;
    public Email: string;
    public MotDePasse: string;
    public Nom: string;
    public Prenom: string;
    public Groups: string[];
    public UserPermissions: string[];
    public IsActive: boolean;
    public IsSuperuser: boolean;
    public LastLogin: Date;

    public constructor(init?: Partial<Utilisateur>) {
        Object.assign(this, init);
    }
}
