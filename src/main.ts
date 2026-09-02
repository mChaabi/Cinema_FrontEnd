import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

registerLocaleData(localeFr);
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));