import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FlockInfoComponent } from './flock-info/flock-info.component';


@NgModule({
    imports: [ SharedModule ],
    declarations: [
        FlockInfoComponent,
    ],
    exports: [
        FlockInfoComponent
    ]
})
export class FarmFormsModule { }
