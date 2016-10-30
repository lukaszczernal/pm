import { NgModule }                 from '@angular/core';
import { Routes,
         RouterModule }             from '@angular/router';

//Layouts
import { FullLayoutComponent }      from './layouts/full-layout.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'manager/dashboard',
        pathMatch: 'full',
    },
    {
        path: 'manager',
        component: FullLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
            },
            {
                path: 'flock',
                loadChildren: 'app/flock/flock.module#FlockModule'
            },
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
