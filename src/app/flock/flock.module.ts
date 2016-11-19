import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, FlockRoutingModule } from './flock.routing';

@NgModule({
  imports: [
    FlockRoutingModule,
    CommonModule
  ],
  declarations: [ routedComponents ]
})
export class FlockModule { }
