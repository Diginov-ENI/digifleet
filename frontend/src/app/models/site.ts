export class Site{
    public Id: number;
    public Libelle: string;

    public constructor(init?: Partial<Site>) {
        Object.assign(this, init);
    }
}
