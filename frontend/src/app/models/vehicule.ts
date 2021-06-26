export class Vehicule{
    public Id: number;
    public Immatriculation: string;
    public Modele: string;
    public Marque: string;
    public Couleur: string;
    public Nb_place: number;

    public constructor(init?: Partial<Vehicule>) {
        Object.assign(this, init);
    }
}
