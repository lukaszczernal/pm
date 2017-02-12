import { NgModule } from '@angular/core';
import { MarketWeightService } from './market-weight.service';
import { MarketDeceaseRateService } from './market-decease-rate.service';

@NgModule({
  providers: [
    MarketWeightService,
    MarketDeceaseRateService
  ]
})
export class MarketModule { }
