/// <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly SITE_URL: string;
    readonly SITE_NAME: string;
    readonly GA_ID: string;
  }
}

declare const process: {
  env: {
    SITE_URL: string;
    SITE_NAME: string;
    GA_ID: string;
  };
};
