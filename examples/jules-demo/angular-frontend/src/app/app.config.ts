import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LucideAngularModule, Car, ClipboardList, LayoutDashboard, History, PlusCircle, CheckCircle, XCircle, PlayCircle, ArrowRight } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule.pick({
      Car,
      ClipboardList,
      LayoutDashboard,
      History,
      PlusCircle,
      CheckCircle,
      XCircle,
      PlayCircle,
      ArrowRight
    }))
  ]
};
