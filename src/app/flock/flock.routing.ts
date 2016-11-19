import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFlockComponent } from './add/add.component';
import { InsertFlockComponent } from './insert/insert.component';
import { DeceaseFlockComponent } from './decease/decease.component';
import { FlockComponent } from './flock.component';

const routes: Routes = [
    {
        path: 'add',
        component: AddFlockComponent,
        data: {
            title: 'Dodaj nowe stado'
        }
    },
    {
        path: ':id',
        component: FlockComponent,
        data: {
            title: 'Stado' // TODO add flock id to the title
        }
    },
    {
        path: ':id/insert',
        component: InsertFlockComponent,
        data: {
            title: 'Nowe wstawienie' // TODO add flock id to the title
        }
    },
    {
        path: ':id/decease',
        component: DeceaseFlockComponent,
        data: {
            title: 'Upadki' // TODO add flock id to the title
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes) ],
    exports: [RouterModule]
})
export class FlockRoutingModule {}

export const routedComponents = [
    DeceaseFlockComponent,
    InsertFlockComponent,
    AddFlockComponent,
    FlockComponent,
];
