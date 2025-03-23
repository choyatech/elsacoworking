/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly app_name: string;
  readonly app_env: string;
  readonly PUBLIC_APPWRITE_PROJECT: string;
  readonly PUBLIC_APPWRITE_DB: string;
  readonly PUBLIC_APPWRITE_POSTS: string;
  readonly PUBLIC_APP_ROUTE: string;
  readonly APPWRITE_API_KEY: string;
  readonly PUBLIC_APPWRITE_CLIENTS: string;
  readonly PUBLIC_EMAIL_USER_ID: string;
  readonly PUBLIC_APPWRITE_STORAGE: string;
  readonly PUBLIC_APPWRITE_EVENTS: string;
  readonly PUBLIC_APPWRITE_TASKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type Models = import("node-appwrite").Models;

declare namespace App {
  interface Locals {
    user?: Models.User<Models.Preferences>;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_APPWRITE_ENDPOINT: string;
  readonly PUBLIC_APPWRITE_PROJECT: string;
  readonly APPWRITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
