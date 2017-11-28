import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SidebarLayoutComponent } from 'app/layouts/sidebar-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'farm',
        pathMatch: 'full'
    },
    {
        path: 'farm',
        component: SidebarLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './farm/farm.module#FarmModule'
            },
        ]
    },
    {
        path: 'calendar',
        component: CalendarComponent
    },
    {
        path: 'settings',
        component: FullLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: './settings/settings.module#SettingsModule'
            },
        ]
    },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
