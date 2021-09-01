import { Emprunt } from './emprunt';


export class Notification{
    public Id: number;
    public Message: string;
    public Is_read:boolean;
    public Emprunt:Emprunt;

    public constructor(init?: Partial<Notification>) {
        Object.assign(this, init);
        this.Emprunt = null;
        if(typeof init !== 'undefined' && init !== null){
            if(typeof init.Emprunt !== 'undefined'){
                this.Emprunt =new Emprunt(init.Emprunt);
            }
          
        }
    }
}