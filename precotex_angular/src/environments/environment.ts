// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //cnServer: "http://192.168.5.105/publicaWs/"
  //cnServer: "https://localhost:5001/"
 //cnServer: "https://localhost:5001/",

 cnServer: "http://192.168.1.36:8070/publicaWs/",
 cnServerTinto: "http://192.168.1.36:8060/publicaWs2/",
 //cnServerTinto:"https://localhost:5001/"
 //cnServerCortes:"https://localhost:7093/api/" //Cortes Encogimiento EIQ
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

