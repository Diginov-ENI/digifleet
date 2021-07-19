export class Permission{
    public Id: number;
    public Codename: string;
    public Name: string;

    public constructor(init?: Partial<Permission>) {
        Object.assign(this, init);
    }
}
