// src/environments/environment.prod.ts
//
// Production config — used when `ng build --configuration=production` runs
// (which is what Vercel does by default).
//
// IMPORTANT: update `redirectUri` and (later) `apiUrl` to match your real
// production URLs before each deploy.
export const environment = {
  production: true,

  // Empty string = "same-origin" — once your .NET API is deployed, set this
  // to its public URL (e.g. 'https://emc-api.azurewebsites.net').
  apiUrl: '',

  azureAd: {
    clientId:    '8dc2a917-6763-4edd-af51-8448dbea3af3',
    tenantId:    'd7be1e00-bf67-40de-a606-1a75a207d413',
    // Replace with your Vercel URL after the first deploy and re-deploy.
    redirectUri: 'https://YOUR-PROJECT.vercel.app',
    authority:   'https://login.microsoftonline.com/d7be1e00-bf67-40de-a606-1a75a207d413',
    scopes:      ['api://c2fffef8-7833-4f64-8a24-b3117374bf8e/access_as_user'],
  },
};
