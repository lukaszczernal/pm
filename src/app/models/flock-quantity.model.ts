import { BaseModel } from 'app/shared/base.model';

export class FlockQuantity extends BaseModel {
    date: string;
    total = 0;
    inserts = 0;
    deceases = 0;
    sales = 0;
}
