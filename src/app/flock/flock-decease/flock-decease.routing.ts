import { Routes } from '@angular/router';

import { FlockDeceaseListComponent } from './list/flock-decease-list.component';
import { FlockDeceaseDetailsComponent } from './details/flock-decease-details.component';

export const routes: Routes = [
    {
        path: '',
        component: FlockDeceaseListComponent
    },
    {
        path: 'add',
        component: FlockDeceaseDetailsComponent,
        data: {
            title: 'Nowe wstawienie'
        }
    },
    {
        path: ':flockInsertId',
        component: FlockDeceaseDetailsComponent,
        data: {
            title: 'Zmień dane o wstawieniu'
        }
    }
];