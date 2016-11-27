import { NgModule }                     from '@angular/core';
import { BrowserModule }                from '@angular/platform-browser';
import { LocationStrategy,
         HashLocationStrategy }         from '@angular/common';

import { AppComponent }                 from './app.component';
import { Ng2BootstrapModule }           from 'ng2-bootstrap/ng2-bootstrap';

import { ChartsModule }                 from 'ng2-charts/ng2-charts';
import { CalendarModule }               from './calendar/calendar.module';

// Routing Module
import { AppRoutingModule }             from './app.routing';

// Layouts
import { FullLayoutComponent }          from './layouts/full-layout.component';

@NgModule({
    imports: [
        ChartsModule,
        BrowserModule,
        CalendarModule,
        AppRoutingModule,
        Ng2BootstrapModule
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
