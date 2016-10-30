import { NgModule }             from '@angular/core';
import { Routes,
         RouterModule }         from '@angular/router';

import { FlockComponent }   from './flock.component';

const routes: Routes = [
    {
        path: '',
        component: FlockComponent,
        data: {
            title: 'Stada'
        }
    },
    {
        path: ':id',
        component: FlockComponent,
        data: {
            title: 'Stado'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FlockRoutingModule {}
