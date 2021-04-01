
import { ErrorHandler } from '@angular/core';

import * as Sentry from 'sentry-cordova';

export class SentryIonicErrorHandler {
    handleError(error) {
        console.log('Error tracked Log', error.message);
        try {
          Sentry.captureException(error.originalError || error);
        } catch (e) {
          console.error(e);
        }
        throw error;
      }
}
