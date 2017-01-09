import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockInsertsListComponent } from './list/flock-inserts-list.component';
import { FlockInsertsDetailsComponent } from './details/flock-inserts-details.component';

import { routes } from './flock-inserts.routing';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
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
