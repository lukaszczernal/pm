import { Routes } from '@angular/router';

import { FlockSalesListComponent } from './list/flock-sales-list.component';
import { FlockSalesDetailsComponent } from './details/flock-sales-details.component';

export const routes: Routes = [
    {
        path: '',
        component: FlockSalesListComponent
    },
    {
        path: 'add',
        component: FlockSalesDetailsComponent,
        data: {
            title: 'Nowa sprzedaż'
        }
    },
    {
        path: ':flockSaleId',
        component: FlockSalesDetailsComponent,
        data: {
            title: 'Zmień dane o sprzedaży'
        }
    }
];
