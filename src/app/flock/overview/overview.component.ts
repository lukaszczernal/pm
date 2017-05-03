import { Component, OnInit, NgZone } from '@angular/core';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockService } from 'app/flock/flock.service';
import { Observable } from 'rxjs/Observable';
import { FlockFodderQuantityService } from 'app/flock/shared/flock-fodder-quantity.service';
import { FlockDeceaseService } from 'app/flock/shared/flock-decease.service';
import { FlockWeightService } from 'app/flock/shared/flock-weight.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    currentQuantity: number;
    flockType: string;
    remainingFodderQuantity: number;
    currentDeceaseRate: number;
    currentStockDensity: number;
    currentWeightDensity: number;
    currentWeight: number;
    deceaseRateChart: any;
    weightChart: any;
    weightDensityChart: any;

    constructor(
        private zone: NgZone,
        private flockService: FlockService,
        private flockWeight: FlockWeightService,
        private flockDecease: FlockDeceaseService,
        private flockQuantity: FlockQuantityService,
        private flockFodderQuantity: FlockFodderQuantityService
    ) {
        this.remainingFodderQuantity = 0;
    }

    ngOnInit() {

         this.flockQuantity.currentQuantity
            .subscribe(quantity =>
                this.zone.run(() => this.currentQuantity = quantity.total));

        this.flockService.currentFlockType
            .subscribe(type =>
                this.zone.run(() => this.flockType = type.name));

        this.flockFodderQuantity.currentFodderQuantity
            .subscribe(quantity =>
                this.zone.run(() => this.remainingFodderQuantity = quantity));

        this.flockDecease.currentDecease
            .subscribe(decease =>
                this.zone.run(() => this.currentDeceaseRate = decease.deceaseRate));

        this.flockDecease.deceasesByweeks
            .map(items => {
                return {
                    type: 'line',
                    data: [
                        {
                            data: items
                                .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day'))
                                .map(item => _.round(item.deceaseRate * 100, 2))
                        },
                        {
                            data: items
                                .map(item => _.round(item.marketDeceaseRate * 100, 2))
                        }
                    ],
                    labels: items
                        .map(item => moment(new Date(item.date)).format('YYYY-MM-DD'))
                };
            })
            .map(chartData => this.getChartData(chartData))
            .subscribe(chartData =>
                this.zone.run(() => this.deceaseRateChart = chartData));

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

        this.flockWeight.weights
            .map(items => {
                return {
                    type: 'line',
                    data: [
                        {
                            data: items
                                .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day'))
                                .map(item => item.weight, 2),
                            spanGaps: false,
                            lineTension: 1
                        },
                        {
                            data: items
                                .map(item => item.marketWeight),
                            lineTension: 1
                        }
                    ],
                    labels: items
                        .map(item => moment(new Date(item.date)).format('YYYY-MM-DD')),
                    options: {
                        elements: {
                            line: {
                                borderWidth: 2
                            },
                            point: {
                                radius: 0
                            }
                        }
                    }
                };
            })
            .map(chartData => this.getChartData(chartData))
            .subscribe(chartData =>
                this.zone.run(() => this.weightChart = chartData));

        this.flockWeight.weights
            .map(items => {
                return {
                    type: 'line',
                    data: [
                        {
                            data: items
                                .filter(item => moment(new Date(item.date)).isSameOrBefore(moment(), 'day'))
                                .map(item => item.density),
                            spanGaps: false,
                            lineTension: 1
                        }
                    ],
                    labels: items
                        .map(item => moment(new Date(item.date)).format('YYYY-MM-DD')),
                    options: {
                        elements: {
                            line: {
                                borderWidth: 2
                            },
                            point: {
                                radius: 0
                            }
                        }
                    }
                };
            })
            .map(chartData => this.getChartData(chartData))
            .subscribe(chartData =>
                this.zone.run(() => this.weightDensityChart = chartData));

    }

    private getChartData(chartCustomData?: getChartDataParams) {
        return _.merge({
            type: 'bar',
            legend: false,
            data: [],
            labels: [],
            colours: [
                {
                    borderWidth: 0,
                    borderColor: 'rgba(225,225,225,1)',
                },
                {
                    borderWidth: 0,
                    borderColor: 'rgba(0,0,0,0.2)',
                }
            ],
            options: {
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }]
                },
                elements: {
                    line: {
                        borderWidth: 1,
                        backgroundColor: 'transparent'
                    },
                    point: {
                        radius: 4,
                        hitRadius: 10,
                        hoverRadius: 4,
                        backgroundColor: '#20a8d8'
                    },
                },
                legend: {
                    display: false
                }
            }
        }, chartCustomData);
    }
}

interface getChartDataParams {
    type?: string;
    data?: {
        data: number[],
        label?: string
    }[];
    labels?: string[];
};
