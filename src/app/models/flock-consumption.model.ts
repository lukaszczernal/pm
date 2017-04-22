import { BaseModel } from 'app/shared/base.model';
import { FlockQuantity } from 'app/models/flock-quantity.model';
import { FlockDatesWeight } from 'app/models/flock-dates-weight.model';

export class FlockConsumption extends BaseModel {

    day: number;
    date: Date;
    quantity: FlockQuantity;
    fcr: number;
    fodderQuantity: number;
    fodderPurchase = 0;
    weight: FlockDatesWeight;

    constructor(data) {
        super(data);
        this.day = data.day + 1;
    }

}
