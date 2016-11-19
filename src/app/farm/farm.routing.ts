import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmComponent } from './farm.component';

const routes: Routes = [
    {
        path: '',
        component: FarmComponent,
    },
    {
        path: 'flock',
        loadChildren: 'app/flock/flock.module#FlockModule'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes) ],
    exports: [RouterModule]
})
export class FarmRoutingModule {}

export const routedComponents = [ FarmComponent ];
