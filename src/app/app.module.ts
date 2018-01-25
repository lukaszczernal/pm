import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';

import { CalendarModule } from './calendar/calendar.module';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SidebarLayoutComponent } from 'app/layouts/sidebar-layout.component';

import { SharedModule } from './shared/shared.module';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        BrowserModule,
        CalendarModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        FullLayoutComponent,
        SidebarLayoutComponent,
        SidebarMenuComponent,
        SidebarComponent
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: '/'
        },
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
