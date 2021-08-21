export interface IDigiResult<T> {
    IsSuccess: boolean;
    LibErreur: string;
    Data: T;
}

export class DigiResult<T> {
    public IsSuccess: boolean | undefined = undefined;
    public LibErreur: string | undefined = undefined;
    public Data: T | undefined = undefined;

    constructor(item?: IDigiResult<T>) {
        for(const key in item) {
            if (key in this) {
                this[key] = item[key];
            }
        }
    }
}