// tslint:disable:no-inferrable-types

import { Component, OnInit, NgZone } from '@angular/core';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockService } from 'app/flock/flock.service';
import { Observable } from 'rxjs/Observable';
import { FlockFodderQuantityService } from 'app/flock/shared/flock-fodder-quantity.service';
import { FlockDeceaseService } from 'app/flock/shared/flock-decease.service';
import { FlockWeightService } from 'app/flock/shared/flock-weight.service';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'rxjs/add/operator/startWith';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    currentQuantity: Observable<number>;
    flockType: Observable<string>;
    currentDeceaseRate: Observable<number>;
    currentStockDensity: number;
    currentWeightDensity: number;
    currentWeight: number;
    deceaseRateChart: any;
    weightChart: Observable<any>;
    weightDensityChart: Observable<any>;
    coopSize: Observable<number>;
    coopName: Observable<string>;
    flockDescription: Observable<string>;

    constructor(
        private zone: NgZone,
        private flockService: FlockService,
        private flockWeight: FlockWeightService,
        private flockDecease: FlockDeceaseService,
        private flockQuantity: FlockQuantityService,
        private flockFodderQuantity: FlockFodderQuantityService
    ) { }

    ngOnInit() {
        this.flockDescription = this.flockService.currentFlock
            .map(flock => flock.description);

        this.coopName = this.flockService.currentFlock
            .map(flock => flock.coopName);

        this.coopSize = this.flockService.currentFlock
            .map(flock => flock.coopSize);

        this.currentQuantity = this.flockQuantity.currentQuantity
            .map(quantity => quantity.total);

        this.flockType = this.flockService.currentFlockType
            .map(type => type.name)

        this.currentDeceaseRate = this.flockDecease.currentDecease
            .map(decease => decease.deceaseRate);

        // this.flockDecease.deceasesByweeks
        //     .map(items => {
        //         return {
        //             type: 'line',
        //             data: [
        //                 {
        //                     data: items
        //                         .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day'))
        //                         .map(item => _.round(item.deceaseRate * 100, 2))
        //                 },
        //                 {
        //                     data: items
        //                         .map(item => _.round(item.marketDeceaseRate * 100, 2))
        //                 }
        //             ],
        //             labels: items
        //                 .map(item => moment(new Date(item.date)).format('YYYY-MM-DD'))
        //         };
        //     })
        //     .map(chartData => this.getChartData(chartData))
        //     .subscribe(chartData =>
        //         this.zone.run(() => this.deceaseRateChart = chartData));

        this.flockWeight.currentWeight
            .subscribe(item =>
                this.zone.run(() => {
                    this.currentWeight = item.weight;
                    this.currentWeightDensity = item.density;
                })
            );

        this.flockQuantity.currentQuantity
            .subscribe(item =>
                this.zone.run(() => this.currentStockDensity = item.density));

        this.weightChart = this.flockWeight.weights
            .map(items => ({
                    results: [
                        {
                            name: 'Waga',
                            series: items
                                .filter(item => item.weight)
                                .map(item => ({
                                    name: item.day,
                                    value: item.weight
                                }))
                        },
                        {
                            name: 'Waga rynkowa',
                            series: items.map(item => ({
                                name: item.day,
                                value: item.marketWeight
                            }))
                        }
                    ]
                }
            ))
            // .map(chartData => this.getChartData(chartData))
            .startWith(this.getChartData({results: []}));
            // .subscribe(chartData =>
            //     this.zone.run(() => this.weightChart = chartData));

        // this.weightDensityChart = this.flockWeight.weights
        //     .map(items => {
        //         return {
        //             type: 'line',
        //             data: [
        //                 {
        //                     data: items
        //                         .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day'))
        //                         .map(item => item.density),
        //                     spanGaps: false,
        //                     lineTension: 1
        //                 }
        //             ],
        //             labels: items
        //                 .map(item => moment(new Date(item.date)).format('YYYY-MM-DD'))
        //         };
        //     })
        //     .map(chartData => this.getChartData(chartData));
        //     // .subscribe(chartData =>
        //     //     this.zone.run(() => this.weightDensityChart = chartData));
    }

    private getChartData(chartCustomData?: GetChartDataParams) {
        return _.merge({
            colorScheme: {
                domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
            },
            results: []
        }, chartCustomData); // TODO add chart presets? colors?
    }
}

interface GetChartDataParams {
    colorScheme?: {
        domain: string[]
    };
    results: {
        name?: string;
        series?: {
            name: string | number;
            value: number
        }[],
    }[]
};
