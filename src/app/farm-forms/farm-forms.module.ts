import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FlockInfoComponent } from './flock-info/flock-info.component';
import { FlockInsertsComponent } from './flock-inserts/flock-inserts.component';


@NgModule({
    imports: [ SharedModule ],
    declarations: [
        FlockInfoComponent,
        FlockInsertsComponent
    ],
    exports: [
        FlockInfoComponent,
        FlockInsertsComponent
    ]
})
export class FarmFormsModule { }
