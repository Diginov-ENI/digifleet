import { Site } from "./site";
import { Utilisateur } from "./utilisateur";

export class Emprunt{
    public Id: number;
    public DateDemande: Date;
    public DateDebut: Date;
    public DateFin: Date;
    public statut: string;
    public destination: string;
    public commentaire: string;
    public type: string;
    public site: Site;
    public conducteur: Utilisateur;
    public passagers: Utilisateur[];

    public constructor(init?: Partial<Emprunt>) {
        Object.assign(this, init);
    }
}
