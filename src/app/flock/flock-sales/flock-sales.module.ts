import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FlockSalesDetailsComponent } from './details/flock-sales-details.component';
import { FlockSalesListComponent } from './list/flock-sales-list.component';

import { routes } from './flock-sales.routing';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FlockSalesDetailsComponent,
    FlockSalesListComponent
  ]
})
export class FlockSalesModule { }
