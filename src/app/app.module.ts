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

// Components
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';

// Global config modules
import { SharedModule } from './shared/shared.module';
import { MatNativeDateModule } from '@angular/material';

import { HttpClientModule } from '@angular/common/http';
import { MarketDataProvider } from 'app/market/market-data/market-data-provider';
import { AppInfo, APP_INFO } from './app.info';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        BrowserModule,
        CalendarModule,
        HttpClientModule,
        AppRoutingModule,
        MatNativeDateModule
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
        },
        {
            provide: APP_INFO,
            useValue: AppInfo
        },
        MarketDataProvider
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
