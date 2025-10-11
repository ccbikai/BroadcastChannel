/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    SITE_URL: string
    RSS_URL: string
    SITE_ORIGIN: string
    BASE_URL: string
  }
}
