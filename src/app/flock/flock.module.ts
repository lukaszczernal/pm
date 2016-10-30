import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlockComponent } from './flock.component';
import { FlockRoutingModule } from './flock.routing';

@NgModule({
  imports: [
    FlockRoutingModule,
    CommonModule
  ],
  declarations: [FlockComponent]
})
export class FlockModule { }
