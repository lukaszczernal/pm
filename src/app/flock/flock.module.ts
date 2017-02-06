import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { routedComponents, FlockRoutingModule } from './flock.routing';
import { CalendarModule } from '../calendar/calendar.module';
import { FarmFormsModule } from '../farm-forms/farm-forms.module';
import { FlockComponent } from './flock.component';
import { FlockService } from './flock.service';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockSalesService } from './shared/flock-sales.service';
import { FlockFodderService } from './shared/flock-fodder.service';
import { MarketModule } from '../market/market.module';

@NgModule({
    imports: [
        FlockRoutingModule,
        FarmFormsModule,
        CalendarModule,
        SharedModule,
        MarketModule
    ],
    declarations: [
        routedComponents,
        FlockComponent
    ],
    providers: [
        FlockInsertsService,
        FlockFodderService,
        FlockSalesService,
        FlockService
    ]
})
export class FlockModule { }
