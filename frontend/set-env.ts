const fs = require('fs');
 // import { writeFile } from 'fs'; if you are using a typescript file

const environmentFile = `export const environment = {
  SENTRY_DSN: "${process.env.SENTRY_DSN}",
  API_URL: "${process.env.API_URL}",
  production:false
};
`;

// Generate environment.ts file
fs.writeFile('./src/environments/environment.dev.ts', environmentFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.dev.ts file generated`);
  }
});