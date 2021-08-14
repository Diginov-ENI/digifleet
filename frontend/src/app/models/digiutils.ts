import { MatSnackBarConfig } from "@angular/material/snack-bar";

export namespace DigiUtils {
    export class ETypeToast {
        static Erreur: DigiEnum = { Code: 'ERROR', Libelle: 'Erreur', Valeur: 'Erreur' };
        static Success: DigiEnum = { Code: 'SUCCESS', Libelle: 'Succès', Valeur: 'Success' };
        static Info: DigiEnum = { Code: 'INFO', Libelle: 'Info', Valeur: 'INFO' };
        static Warning: DigiEnum = { Code: 'WARNING', Libelle: 'Warning', Valeur: 'WARNING' };
    }
}

export interface DigiEnum {
    Valeur: string;
    Libelle: string;
    Code: string;
}

export class ConfigMatsnackbar {
    public static configError: MatSnackBarConfig = {
        panelClass: 'is-error',
        duration: 6000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    public static configSuccess: MatSnackBarConfig = {
        panelClass: 'is-success',
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    public static configWarning: MatSnackBarConfig = {
        panelClass: 'is-warning',
        duration: 6000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }
    public static configInfo: MatSnackBarConfig = {
        panelClass: 'is-info',
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
    }

    public static setToast(isErreur, libMessage): any {
        return {
            data: {
                type: isErreur ? DigiUtils.ETypeToast.Erreur.Code : DigiUtils.ETypeToast.Success.Code,
                libMessageToast: libMessage,
            },
            ...isErreur ? ConfigMatsnackbar.configError : ConfigMatsnackbar.configSuccess
        }
    }

    public static setInfoToast(isCritical, libMessage): any {
        return {
            data: {
                type: isCritical ? DigiUtils.ETypeToast.Warning.Code : DigiUtils.ETypeToast.Info.Code,
                libMessageToast: libMessage,
            },
            ...isCritical ? ConfigMatsnackbar.configWarning : ConfigMatsnackbar.configInfo
        }
    }
}
