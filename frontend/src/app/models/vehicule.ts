export class Vehicule{
    public Id: number;
    public immatriculation: string;
    public modele: string;
    public marque: string;
    public couleur: string;
    public nb_place: string;
    public is_active: boolean;

    public constructor(init?: Partial<Vehicule>) {
        Object.assign(this, init);
    }
}
