import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FlockRoutingModule } from './flock.routing';
import { CalendarModule } from '../calendar/calendar.module';
import { FarmFormsModule } from '../farm-forms/farm-forms.module';
import { FlockComponent } from './flock.component';
import { FlockService } from '../shared/service/flock.service';
import { FlockInsertsService } from './shared/flock-inserts.service';
import { FlockDatesService } from './shared/flock-dates.service';
import { FlockSalesService } from './shared/flock-sales.service';
import { FlockFodderService } from './shared/flock-fodder.service';
import { FlockWeightService } from './shared/flock-weight.service';
import { MarketModule } from '../market/market.module';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';
import { FlockMenuComponent } from './flock-menu/flock-menu.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FlockInsertsModule } from './flock-inserts/flock-inserts.module';
import { FlockNutritionComponent } from './flock-nutrition/flock-nutrition.component';
import { OverviewComponent } from './overview/overview.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { ClosingComponent } from './closing/closing.component';
import { InfoComponent } from './info/info.component';
import { FlockBreedingService } from './shared/flock-breeding.service';
import { FlockAnalyticsService } from './shared/flock-analytics.service';
import { FlockHealthService } from './shared/flock-health.service';

@NgModule({
    imports: [
        FlockRoutingModule,
        FlockInsertsModule,
        FarmFormsModule,
        NgxChartsModule,
        CalendarModule,
        SharedModule,
        MarketModule,
    ],
    declarations: [
        FlockNutritionComponent,
        OverviewComponent,
        AnalysisComponent,
        ClosingComponent,
        InfoComponent,
        FlockComponent,
        FlockMenuComponent
    ],
    providers: [
        FlockDeceaseItemService,
        FlockAnalyticsService,
        FlockBreedingService,
        FlockInsertsService,
        FlockHealthService,
        FlockFodderService,
        FlockWeightService,
        FlockSalesService,
        FlockDatesService,
        FlockService
    ]
})
export class FlockModule { }
