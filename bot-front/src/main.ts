import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

fetch('/assets/config.json')
  .then((response) => response.json())
  .then((config) => {
    // Inserta las variables de entorno
    environment.apiBack = config.apiBack || environment.apiBack;
    environment.apiBot = config.apiBot || environment.apiBot;
    
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  })
  .catch((error) => {
    console.error('Error al cargar config.json:', error);
    console.warn('Se usarán las variables predeterminadas del environment');
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  });

/* platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
 */