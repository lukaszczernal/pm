import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FlockWeightComponent } from './flock-weight.component';

import { routes } from './flock-weight.routing';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        SharedModule
    ],
    declarations: [ FlockWeightComponent ],
    exports: [ RouterModule ]
})
export class FlockWeightModule { }
