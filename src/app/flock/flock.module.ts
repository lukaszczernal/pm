import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { routedComponents, FlockRoutingModule } from './flock.routing';
import { CalendarModule } from '../calendar/calendar.module';
import { FarmFormsModule } from '../farm-forms/farm-forms.module';

@NgModule({
    imports: [
        FlockRoutingModule,
        FarmFormsModule,
        CalendarModule,
        SharedModule
    ],
    declarations: [
        routedComponents
    ]
})
export class FlockModule { }
