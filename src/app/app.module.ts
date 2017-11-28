import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { AppComponent } from './app.component';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { CalendarModule } from './calendar/calendar.module';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SidebarLayoutComponent } from 'app/layouts/sidebar-layout.component';

import { SharedModule } from './shared/shared.module';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        ChartsModule,
        BrowserModule,
        CalendarModule,
        AppRoutingModule,
        MatButtonModule,
        MatIconModule
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        SidebarLayoutComponent
    ],
    providers: [{
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    }],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
