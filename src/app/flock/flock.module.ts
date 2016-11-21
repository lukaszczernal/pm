import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { routedComponents, FlockRoutingModule } from './flock.routing';
import { CalendarModule } from '../calendar/calendar.module';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  imports: [
    FlockRoutingModule,
    CalendarModule,
    SharedModule,
    CommonModule
  ],
  declarations: [ routedComponents, OverviewComponent ]
})
export class FlockModule { }
