import { Component, ViewEncapsulation } from '@angular/core';
import { MarketDataProvider } from './market/market-data/market-data-provider';

@Component({
    selector: 'app-component',
    template: '<router-outlet></router-outlet>',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {

    constructor(marketData: MarketDataProvider) { }
}
