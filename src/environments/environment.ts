// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api_url: 'https://apigw.seldatdirect.com/qc/sel2b-nab/api/api/v1/',
  url: 'http://nabp.qc.seldatdirect.com/sel2b/',
  srs_url: 'http://srs-haca.qc.seldatdirect.com/',
  nab_home: 'http://nabp.qc.seldatdirect.com/#/home',
  nab_url: 'http://nabp.qc.seldatdirect.com'
};

