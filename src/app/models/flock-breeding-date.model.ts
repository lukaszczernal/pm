/*tslint:disable:no-inferrable-types */

import { BaseModel } from 'app/shared/base.model';
import { FlockDeceaseItem } from './flock-decease-item.model';

export class FlockBreedingDate extends BaseModel {

    day: number;
    date: Date;
    weight: number;
    totalWeight: number;
    predictedWeight: number;
    totalPredictedWeight: number;
    marketWeight: number;
    totalWeightIncrement: number;
    predictedWeightIncrement: number;
    totalPredictedWeightIncrement: number;
    isLastWeekDay: boolean;
    quantity: number;
    deceases: number;
    totalDecease: number;
    inserts: number;
    totalInserts: number;
    sales: number;
    totalSales: number;
    deceaseRate: number;
    marketDeceaseRate: number;
    density: number;
    fcr: number;
    fodderPurchase: number;
    fodderQuantity: number;

    constructor(data) {
        super(data);
        this.isLastWeekDay = (this.day > 0) && ((this.day % 7) === 0);
    }

}
