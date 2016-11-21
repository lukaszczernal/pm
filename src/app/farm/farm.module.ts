import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FarmRoutingModule } from './farm.routing';
import { Farm } from './farm.service';
import { FarmComponent } from './farm.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  imports: [
    FarmRoutingModule,
    CommonModule,
    SharedModule
  ],
  declarations: [
    FarmComponent,
    OverviewComponent
  ],
  providers: [ Farm ]
})
export class FarmModule { }
