import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockInsertsListComponent } from './list/flock-inserts-list.component';
import { FlockInsertsDetailsComponent } from './details/flock-inserts-details.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
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
                path: ':id',
                component: FlockInsertsDetailsComponent,
                data: {
                    title: 'Zmień dane o wstawieniu'
                }
            }
        ])
    ],
    declarations: [
        FlockInsertsListComponent,
        FlockInsertsDetailsComponent
    ],
    providers: [
        FlockInsertsService
    ],
    exports: [
        RouterModule
    ]
})
export class FlockInsertsModule { }
