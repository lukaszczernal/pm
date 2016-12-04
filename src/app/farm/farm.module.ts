import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { routedComponents, FarmRoutingModule } from './farm.routing';
import { FarmComponent } from './farm.component';
import { FlockModule } from '../flock/flock.module';
import { FarmFormsModule } from '../farm-forms/farm-forms.module';
import { FlockService } from './shared/flock.service';

@NgModule({
  imports: [
    FarmRoutingModule,
    FarmFormsModule,
    SharedModule,
    FlockModule
  ],
  declarations: [
    FarmComponent,
    routedComponents
  ],
  providers: [
    FlockService
  ]
})
export class FarmModule { }