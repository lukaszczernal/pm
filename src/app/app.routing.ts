import { NgModule }                 from '@angular/core';
import { Routes,
         RouterModule }             from '@angular/router';

//Layouts
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
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
