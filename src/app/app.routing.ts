import { NgModule }                 from '@angular/core';
import { Routes,
         RouterModule }             from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';

// Layouts
import { FullLayoutComponent }      from './layouts/full-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'farm',
        pathMatch: 'full'
    },
    {
        path: 'farm',
        component: FullLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: 'app/farm/farm.module#FarmModule'
            },
        ]
    },
    {
        path: 'calendar',
        component: CalendarComponent
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
