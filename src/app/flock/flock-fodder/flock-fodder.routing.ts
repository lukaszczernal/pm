import { Routes } from '@angular/router';

import { FlockFodderListComponent } from './list/flock-fodder-list.component';
import { FlockFodderDetailsComponent } from './details/flock-fodder-details.component';

export const routes: Routes = [
    {
        path: '',
        component: FlockFodderListComponent
    },
    {
        path: 'add',
        component: FlockFodderDetailsComponent,
        data: {
            title: 'Zakup paszy'
        }
    },
    {
        path: ':flockFodderId',
        component: FlockFodderDetailsComponent,
        data: {
            title: 'Zmień dane o zakupie paszy'
        }
    }
];
