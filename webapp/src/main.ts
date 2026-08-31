import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes'; // Create this with your desired routes
bootstrapApplication(AppComponent, {
  providers: [    
    provideZoneChangeDetection(),provideRouter(routes), // no routes yet, but enables RouterModule
    provideHttpClient(withXhr()),
    provideAnimations()
  ]
});
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

