import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { routedComponents, FarmRoutingModule } from './farm.routing';
import { FarmComponent } from './farm.component';
import { FlockModule } from '../flock/flock.module';
import { FarmFormsModule } from '../farm-forms/farm-forms.module';

@NgModule({
  imports: [
    SharedModule,
    FarmRoutingModule,
    FarmFormsModule,
    FlockModule
  ],
  declarations: [
    FarmComponent,
    routedComponents
  ]
})
export class FarmModule { }
