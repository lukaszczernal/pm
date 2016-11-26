import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FarmRoutingModule } from './farm.routing';
import { Farm } from './farm.service';
import { FarmComponent } from './farm.component';
import { OverviewComponent } from './overview/overview.component';
import { AddFlockComponent } from './add-flock/add-flock.component';

@NgModule({
  imports: [
    FarmRoutingModule,
    SharedModule
  ],
  declarations: [
    FarmComponent,
    OverviewComponent,
    AddFlockComponent
  ],
  providers: [ Farm ]
})
export class FarmModule { }
