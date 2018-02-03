import { Routes } from '@angular/router';

import { FlockInsertsListComponent } from './list/flock-inserts-list.component';
import { FlockInsertsDetailsComponent } from './details/flock-inserts-details.component';

export const routes: Routes = [
    {
        path: '',
        component: FlockInsertsListComponent
    },
    {
        path: 'add',
        component: FlockInsertsDetailsComponent,
        data: {
            title: 'Nowe wstawienie'
        }
    },
    {
        path: ':flockInsertId',
        component: FlockInsertsDetailsComponent,
        data: {
            title: 'Zmień dane o wstawieniu'
        }
    }
];
