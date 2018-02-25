import { BaseModel } from 'app/shared/base.model';
import { FlockWeight } from 'app/models/flock-weight.model';

export class FlockDatesWeight extends BaseModel {

    day: number;
    date: Date;
    weightItem: FlockWeight;
    weight: number;
    weightTotal: number;
    marketWeight: number;
    increment: number;
    incrementTotal: number;
    isLastWeekDay: boolean;
    quantity: number;

    constructor(data) {
        super(data);
        this.isLastWeekDay = (this.day % 7) === 0;
    }

}
