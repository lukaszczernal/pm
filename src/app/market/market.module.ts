import { NgModule } from '@angular/core';
import { MarketWeightService } from './market-weight.service';
import { MarketDeceaseRateService } from './market-decease-rate.service';
import { MarketConsumptionService } from './market-consumption.service';

@NgModule({
  providers: [
    MarketWeightService,
    MarketConsumptionService,
    MarketDeceaseRateService
  ]
})
export class MarketModule { }
