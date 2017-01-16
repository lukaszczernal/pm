import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FlockInsertsModule } from './flock-inserts/flock-inserts.module';
import { FlockInfoComponent } from './flock-info/flock-info.component';

@NgModule({
    imports: [
        SharedModule,
        FlockInsertsModule
    ],
    declarations: [
        FlockInfoComponent
    ],
    exports: [
        FlockInfoComponent,
        FlockInsertsModule
    ]
})
export class FarmFormsModule { }
