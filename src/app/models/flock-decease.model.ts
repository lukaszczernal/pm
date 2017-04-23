import { BaseModel } from 'app/shared/base.model';
import { FlockDeceaseItem } from 'app/models/flock-decease-item.model';

export class FlockDecease extends BaseModel {

    day: number;
    date: Date;
    deceaseItem: FlockDeceaseItem;
    decease: number;
    deceaseTotal: number;
    deceaseRate: number;
    marketDeceaseRate: number;
    flockQuantity: number;
    isLastWeekDay: boolean;

    constructor(data) {
        super(data);
        this.day = data.day + 1;
        this.isLastWeekDay = (this.day % 7) === 0;
    }

}
