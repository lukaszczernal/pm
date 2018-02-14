import { BaseModel } from 'app/shared/base.model';
import { FlockDeceaseItem } from 'app/models/flock-decease-item.model';
import { FlockQuantity } from './flock-quantity.model';

export class FlockDecease extends BaseModel {

    day: number;
    date: Date;
    deceaseItem: FlockDeceaseItem;
    decease: number;
    deceaseTotal: number;
    deceaseRate: number;
    marketDeceaseRate: number;
    flockQuantity: FlockQuantity;
    isLastWeekDay: boolean;

    constructor(data) {
        super(data);
        this.day = data.day;
        this.isLastWeekDay = (this.day > 0) && (this.day % 7) === 0;
    }

}
