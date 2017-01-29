import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FlockDeceaseService } from './flock-decease.service';
import { FlockDeceaseComponent } from './flock-decease.component';
import { FlockDeceaseListComponent } from './list/flock-decease-list.component';
import { FlockDeceaseDetailsComponent } from './details/flock-decease-details.component';

import { routes } from './flock-decease.routing';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [
        FlockDeceaseComponent,
        FlockDeceaseListComponent,
        FlockDeceaseDetailsComponent
    ],
    providers: [ FlockDeceaseService ],
    exports: [ RouterModule ]
})
export class FlockDeceaseModule { }
