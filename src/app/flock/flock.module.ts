import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, FlockRoutingModule } from './flock.routing';
import { CalendarModule } from '../calendar/calendar.module';

@NgModule({
  imports: [
    FlockRoutingModule,
    CalendarModule,
    CommonModule
  ],
  declarations: [ routedComponents ]
})
export class FlockModule { }
