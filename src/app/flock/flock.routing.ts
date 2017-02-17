import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlockComponent } from './flock.component';
import { InfoComponent } from './info/info.component';
import { ClosingComponent } from './closing/closing.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { OverviewComponent } from './overview/overview.component';
import { NutritionComponent } from './nutrition/nutrition.component';

const routes: Routes = [
    {
        path: '',
        component: FlockComponent,
        children: [
            {
                path: ':id',
                component: OverviewComponent,
                data: {
                    title: 'Stado' // TODO add flock id to the title
                }
            },
            {
                path: ':id/insert',
                data: {
                    title: 'Wstawienia' // TODO add flock id to the title
                },
                loadChildren: 'app/farm-forms/flock-inserts/flock-inserts.module#FlockInsertsModule'
            },
            {
                path: ':id/decease',
                data: { title: 'Upadki' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-decease/flock-decease.module#FlockDeceaseModule'
            },
            {
                path: ':id/sales',  // TODO we should stick with sale not sales
                data: { title: 'Sprzedaż' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-sales/flock-sales.module#FlockSalesModule'
            },
            {
                path: ':id/closing',
                component: ClosingComponent,
                data: {
                    title: 'Zakończenie hodowli' // TODO add flock id to the title
                }
            },
            {
                path: ':id/nutrition',
                component: NutritionComponent,
                data: {
                    title: 'Żywienie' // TODO add flock id to the title
                }
            },
            {
                path: ':id/health',
                data: { title: 'Leczenie i Profilaktyka' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-health/flock-health.module#FlockHealthModule'
            },
            {
                path: ':id/fodder',
                data: { title: 'Zakupy paszy' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-fodder/flock-fodder.module#FlockFodderModule'
            },
            {
                path: ':id/weight',
                data: { title: 'Waga' }, // TODO add flock id to the title
                loadChildren: 'app/flock/flock-weight/flock-weight.module#FlockWeightModule'
            },
            {
                path: ':id/analysis',
                component: AnalysisComponent,
                data: {
                    title: 'Analizy' // TODO add flock id to the title
                }
            },
            {
                path: ':id/info',
                component: InfoComponent,
                data: {
                    title: 'Opis stada' // TODO add flock id to the title
                }
            },
            {
                path: ':id/calendar',
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

export const routedComponents = [
    NutritionComponent,
    OverviewComponent,
    AnalysisComponent,
    ClosingComponent,
    InfoComponent
];
