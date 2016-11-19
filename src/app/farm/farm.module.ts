import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routedComponents, FarmRoutingModule } from './farm.routing';

@NgModule({
  imports: [
    FarmRoutingModule,
    CommonModule
  ],
  declarations: [ routedComponents ]
})
export class FarmModule { }
