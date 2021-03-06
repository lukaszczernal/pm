import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FarmComponent } from './farm.component';
import { OverviewComponent } from './overview/overview.component';
import { AddFlockComponent } from './add-flock/add-flock.component';

const routes: Routes = [
    {
        path: '',
        component: FarmComponent,
        children: [
            {
                path: '',
                redirectTo: 'overview'
            },
            {
                path: 'overview',
                component: OverviewComponent,
                data: {
                    title: 'Panel główny'
                }
            },
            {
                path: 'add-flock',
                component: AddFlockComponent,
                data: {
                    title: 'Dodaj nowe stado'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes) ],
    exports: [RouterModule]
})
export class FarmRoutingModule {}

export const routedComponents = [
    OverviewComponent,
    AddFlockComponent
];
