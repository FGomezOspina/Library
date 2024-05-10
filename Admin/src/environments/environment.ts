// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  defaultauth: 'devbackend',
  firebaseConfig: {
    apiKey: "AIzaSyASsaVCaIBUSMJ96JwtXg4fMWkyBL9Wwf4",
    authDomain: "robin-notifications.firebaseapp.com",
    projectId: "robin-notifications",
    storageBucket: "robin-notifications.appspot.com",
    messagingSenderId: "120758779046",
    appId: "1:120758779046:web:dab46dd83b721584078867",
    measurementId: "G-LXS5P7M6SY",
    vapidKey: "BOoBA5JcOshO0saqF4QUVKqIcrCVENOUVur2SbTUplUd6tXNscwUZrbHoNLYZ3hzgaopeum0JrJNTR5pePNw-84"
  },
  stripePublicKey: 'pk_test_51MF8BIBSVqJtb1Fx5SOHz06j8qsmNYdCwvLSjgnIwpghbYoVOedCaZupSaGWP4g4bIEm1IFRCltp7EkV2pSXsjVR004PSfHB0l',
  payu: {
    merchantId: '1003897',
    accountId: '1012620',
    apiKey: 'GUWYj9YrFMBY3tpS79Lg7L50yF'
  },
  // api: 'https://robin-ai.xyz:8443/api',
  // api3: 'http://190.27.33.250:8000/api',
  api: 'http://localhost:8000/api',
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
