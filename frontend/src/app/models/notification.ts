import { Emprunt } from './emprunt';


export class Notification{
    public Id: number;
    public Message: string;
    public IsRead:boolean;
    public Emprunt:Emprunt;
    public Date:Date;

    public constructor(init?: Partial<Notification>) {
        Object.assign(this, init);
        this.Emprunt = null;
        if(typeof init !== 'undefined' && init !== null){
            if(typeof init.Emprunt !== 'undefined'){
                this.Emprunt =new Emprunt(init.Emprunt);
            }
            if(typeof init.Date !== 'undefined'){
                this.Date =new Date(init.Date);
            }
          
        }
    }
}