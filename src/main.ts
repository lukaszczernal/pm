import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/publishReplay'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/combineLatest'

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
