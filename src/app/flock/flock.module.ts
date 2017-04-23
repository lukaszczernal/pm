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
import { ChartsModule } from 'ng2-charts';

@NgModule({
    imports: [
        FlockRoutingModule,
        FarmFormsModule,
        CalendarModule,
        SharedModule,
        MarketModule,
        ChartsModule
    ],
    declarations: [
        routedComponents,
        FlockComponent
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
