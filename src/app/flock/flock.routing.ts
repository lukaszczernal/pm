import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlockComponent } from './flock.component';
import { InfoComponent } from './info/info.component';
import { ClosingComponent } from './closing/closing.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { OverviewComponent } from './overview/overview.component';
import { FlockNutritionComponent } from './flock-nutrition/flock-nutrition.component';

const routes: Routes = [
    {
        path: ':id',
        component: FlockComponent,
        children: [
            {
                path: '',
                redirectTo: 'overview'
            },
            {
                path: 'overview',
                data: {
                    title: 'Informacje ogólne' // TODO add flock id to the title
                },
                component: OverviewComponent
            },
            {
                path: 'insert',
                data: {
                    title: 'Wstawienia' // TODO add flock id to the title
                },
                loadChildren: 'app/flock/flock-inserts/flock-inserts.module#FlockInsertsModule'
            },
            {
                path: 'decease',
                data: { title: 'Upadki' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-decease/flock-decease.module#FlockDeceaseModule'
            },
            {
                path: 'sales',  // TODO we should stick with sale not sales
                data: { title: 'Sprzedaż' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-sales/flock-sales.module#FlockSalesModule'
            },
            {
                path: 'closing',
                component: ClosingComponent,
                data: {
                    title: 'Zakończenie hodowli' // TODO add flock id to the title
                }
            },
            {
                path: 'nutrition',
                component: FlockNutritionComponent,
                data: {
                    title: 'Żywienie' // TODO add flock id to the title
                }
            },
            {
                path: 'nutrition/fodder',
                loadChildren: 'app/flock/flock-fodder/flock-fodder.module#FlockFodderModule'
            },
            {
                path: 'health',
                data: { title: 'Leczenie i Profilaktyka' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-health/flock-health.module#FlockHealthModule'
            },
            {
                path: 'weight',
                data: { title: 'Waga' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-weight/flock-weight.module#FlockWeightModule'
            },
            {
                path: 'analysis',
                component: AnalysisComponent,
                data: {
                    title: 'Analizy' // TODO add flock id to the title
                }
            },
            {
                path: 'info',
                component: InfoComponent,
                data: {
                    title: 'Opis stada' // TODO add flock id to the title
                }
            },
            {
                path: 'calendar',
                component: CalendarComponent,
                data: {
                    title: 'Kalendarz' // TODO add flock id to the title
                }
            }
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class FlockRoutingModule {}
