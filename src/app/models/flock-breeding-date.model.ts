import { BaseModel } from 'app/shared/base.model';
import { FlockQuantity } from './flock-quantity.model';
import { FlockDeceaseItem } from './flock-decease-item.model';

export class FlockBreedingDate extends BaseModel {

    day: number;
    date: Date;
    weight: number;
    totalWeight: number;
    marketWeight: number;
    weightIncrement: number;
    totalWeightIncrement: number;
    isLastWeekDay: boolean;
    quantity: FlockQuantity;
    decease: number;
    totalDecease: number;
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
