import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideClientHydration } from '@angular/platform-browser';


export const appConfig: ApplicationConfig = {
 providers: [
   provideZoneChangeDetection({ eventCoalescing: true }),
   provideRouter(routes),
   provideClientHydration(),
   provideHttpClient() ,
   provideCharts(withDefaultRegisterables()),
   { provide: LOCALE_ID, useValue: 'fr' }
 ]
};