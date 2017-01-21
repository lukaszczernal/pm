import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { routedComponents, FlockRoutingModule } from './flock.routing';
import { CalendarModule } from '../calendar/calendar.module';
import { FarmFormsModule } from '../farm-forms/farm-forms.module';
import { FlockComponent } from './flock.component';
import { FlockService } from './flock.service';
import { FlockInsertsService } from './shared/flock-inserts.service';

@NgModule({
    imports: [
        FlockRoutingModule,
        FarmFormsModule,
        CalendarModule,
        SharedModule
    ],
    declarations: [
        routedComponents,
        FlockComponent
    ],
    providers: [
        FlockInsertsService,
        FlockService
    ]
})
export class FlockModule { }
