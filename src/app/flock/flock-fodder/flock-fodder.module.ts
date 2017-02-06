import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FlockFodderListComponent } from './list/flock-fodder-list.component';
import { FlockFodderDetailsComponent } from './details/flock-fodder-details.component';

import { routes } from './flock-fodder.routing';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FlockFodderListComponent, FlockFodderDetailsComponent]
})
export class FlockFodderModule { }
