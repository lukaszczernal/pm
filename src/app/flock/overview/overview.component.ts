// tslint:disable:no-inferrable-types

import { Component, OnInit, NgZone } from '@angular/core';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockService } from 'app/flock/flock.service';
import { Observable } from 'rxjs/Observable';
import { FlockFodderQuantityService, FlockFodderQuantity } from 'app/flock/shared/flock-fodder-quantity.service';
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
    currentWeightDensity: Observable<number>;
    currentWeight: Observable<number>;
    currentFodderQuantity: Observable<number>;
    deceaseRateChart: Observable<any>;
    weightChart: Observable<any>;
    coopSize: Observable<number>;
    coopName: Observable<string>;
    flockDescription: Observable<string>;
    fodderQuantity: Observable<any>;

    constructor(
        private zone: NgZone,
        private flockService: FlockService,
        private flockWeight: FlockWeightService,
        private flockDecease: FlockDeceaseService,
        private flockQuantity: FlockQuantityService,
        private flockFodderQuantity: FlockFodderQuantityService
    ) { }

    ngOnInit() {
        this.currentFodderQuantity = this.flockFodderQuantity.currentFodderQuantity;

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

        this.currentDeceaseRate = this.flockDecease.currentDeceaseRate;

        this.deceaseRateChart = this.flockDecease.deceasesByweeks
            .map(items => ({
                yAxisFormat: val => `${Math.round(val * 100)}%`,
                results: [
                    {
                        name: 'Śmiertelność',
                        series: items
                            .filter(item => item.deceaseRate)
                            .map(item => ({
                                name: `Tydzień ${item.day / 7}`,
                                value: item.deceaseRate
                            }))
                    },
                    {
                        name: 'Śmiertelność - rynek',
                        series: items
                            .filter(item => item.marketDeceaseRate)
                            .map(item => ({
                                name: `Tydzień ${item.day / 7}`,
                                value: item.marketDeceaseRate
                            }))
                    }
                ]
            }))
            .map(chartData => this.getChartData(chartData))
            .startWith(this.getChartData());

        this.currentWeight = this.flockWeight.currentWeight
            .map(item => item.weight);

        this.currentWeightDensity = this.flockWeight.currentDensity
            .map(item => item ? item : 0);

        this.fodderQuantity = this.flockFodderQuantity.quantityByDate
            .map(items => ({
                yAxisFormat: val => `${val / 1000}t`,
                results: [
                    {
                        name: 'Stan paszy',
                        series: items
                            .map(item => ({
                                name: item.day,
                                value: item.fodderQuantity
                            }))
                    }
                ]
            }
        ))
        .map(chartData => this.getChartData(chartData))
        .startWith(this.getChartData());

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
                        name: 'Waga rynkowa', // TODO work on colors
                        series: items
                            .filter(item => item.marketWeight)
                            .map(item => ({
                                name: item.day,
                                value: item.marketWeight
                        }))
                    }
                ]
            }))
            .map(chartData => this.getChartData(chartData))
            .startWith(this.getChartData());

    }

    private getChartData(chartCustomData?: GetChartDataParams) {
        return _.merge({
            colorScheme: {
                domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
            },
            results: []
        }, chartCustomData);
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
