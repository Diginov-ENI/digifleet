import { Site } from "./site";

export class Vehicule{
    public Id: number;
    public Immatriculation: string;
    public Modele: string;
    public Marque: string;
    public Couleur: string;
    public NbPlace: string;
    public IsActive: boolean;
    public Site: Site;

    public constructor(init?: Partial<Vehicule>) {
        Object.assign(this, init);
    }
}
