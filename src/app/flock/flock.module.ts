import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { routedComponents, FlockRoutingModule } from './flock.routing';
import { CalendarModule } from '../calendar/calendar.module';
import { FarmFormsModule } from '../farm-forms/farm-forms.module';
import { FlockComponent } from './flock.component';
import { FlockService } from './flock.service';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockDatesService } from './shared/flock-dates.service';
import { FlockSalesService } from './shared/flock-sales.service';
import { FlockFodderService } from './shared/flock-fodder.service';
import { FlockWeightService } from './shared/flock-weight.service';
import { FlockQuantityService } from './shared/flock-quantity.service';
import { MarketModule } from '../market/market.module';
import { FlockDeceaseService } from './shared/flock-decease.service';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';
import { FlockFodderQuantityService } from 'app/flock/shared/flock-fodder-quantity.service';
import { FlockMenuComponent } from './flock-menu/flock-menu.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
    imports: [
        FlockRoutingModule,
        FarmFormsModule,
        NgxChartsModule,
        CalendarModule,
        SharedModule,
        MarketModule
    ],
    declarations: [
        routedComponents,
        FlockComponent,
        FlockMenuComponent
    ],
    providers: [
        FlockFodderQuantityService,
        FlockDeceaseItemService,
        FlockDeceaseService,
        FlockQuantityService,
        FlockInsertsService,
        FlockFodderService,
        FlockWeightService,
        FlockSalesService,
        FlockDatesService,
        FlockService
    ]
})
export class FlockModule { }
