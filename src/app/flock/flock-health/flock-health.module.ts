import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FlockHealthComponent } from './flock-health.component';
import { FlockHealthService } from './flock-health.service';

import { routes } from './flock-health.routing';
import { FlockHealthListComponent } from './list/flock-health-list.component';
import { FlockHealthDetailsComponent } from './details/flock-health-details.component';

@NgModule({
        imports: [
            RouterModule.forChild(routes),
            SharedModule
        ],
    declarations: [ FlockHealthComponent, FlockHealthListComponent, FlockHealthDetailsComponent ],
    providers: [ FlockHealthService ],
    exports: [ RouterModule ]
    })
export class FlockHealthModule { }
