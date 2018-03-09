// tslint:disable:no-inferrable-types

import { Component, OnInit } from '@angular/core';
import { FlockService } from 'app/flock/flock.service';
import { Observable } from 'rxjs/Observable';
import { FlockBreedingService } from '../shared/flock-breeding.service';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'rxjs/add/operator/startWith';
import { Flock } from '../../models/flock.model';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    currentQuantity: Observable<number>;
    flockType: Observable<string>;
    currentDeceaseRate: Observable<number>;
    currentDensity: Observable<number>;
    currentWeight: Observable<number>;
    currentFodderQuantity: Observable<number>;
    deceaseRateChart: Observable<any>;
    weightChart: Observable<any>;
    fodderQuantity: Observable<any>;
    fcr: Observable<number>;
    eww: Observable<number>;
    flock: Observable<Flock>;
    isFlockActive: Observable<boolean>;

    constructor(
        private flockService: FlockService,
        private flockBreeding: FlockBreedingService
    ) { }

    ngOnInit() {

        this.eww = this.flockBreeding.eww;

        this.fcr = this.flockBreeding.fcr;

        this.currentFodderQuantity = this.flockBreeding.currentBreedingDate
            .map(today => today.fodderQuantity);

        this.currentDeceaseRate = this.flockBreeding.currentBreedingDate
            .map(today => today.deceaseRate);

        this.currentWeight = this.flockBreeding.currentBreedingDate
            .map(today => today.weight);

        this.currentDensity = this.flockBreeding.currentBreedingDate
            .map(today => today.density);

        this.currentQuantity = this.flockBreeding.currentBreedingDate
            .map(today => today.quantity.total);

        this.isFlockActive = this.flockService.isActive;

        this.flock = this.flockService.currentFlock;

        this.flockType = this.flockService.currentFlockType
            .map(type => type.name)


        this.deceaseRateChart = this.flockBreeding.breedingStore
            .map(items => items
                .filter(item => item.isLastWeekDay))
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

        this.fodderQuantity = this.flockBreeding.breedingStore
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

        this.weightChart = this.flockBreeding.breedingStore
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
