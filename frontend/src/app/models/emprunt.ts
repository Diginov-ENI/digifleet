import { Site } from "./site";
import { Utilisateur } from "./utilisateur";

export class Emprunt{
    public Id: number;
    public DateDemande: Date;
    public DateDebut: Date;
    public DateFin: Date;
    public Statut: string;
    public Destination: string;
    public Commentaire: string;
    public Type: string;
    public Site: Site;
    public Conducteur: Utilisateur;
    public Passagers: Utilisateur[];

    public constructor(init?: Partial<Emprunt>) {
        Object.assign(this, init);
    }
}