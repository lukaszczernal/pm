import { Routes } from '@angular/router';

import { FlockHealthListComponent } from './list/flock-health-list.component';
import { FlockHealthDetailsComponent } from './details/flock-health-details.component';

export const routes: Routes = [
    {
        path: '',
        component: FlockHealthListComponent
    },
    {
        path: 'add',
        component: FlockHealthDetailsComponent,
        data: {
            title: 'Szczegóły profilaktyki/leczenia'
        }
    },
    {
        path: ':flockHealthId',
        component: FlockHealthDetailsComponent,
        data: {
            title: 'Zmień dane o profilaktyce/leczeniu'
        }
    }
];
