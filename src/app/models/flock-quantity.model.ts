/*tslint:disable:no-inferrable-types */

import { BaseModel } from 'app/shared/base.model';

export class FlockQuantity extends BaseModel {
    date: Date;
    total: number = 0;
    totalInserts: number = 0;
    inserts: number = 0;
    deceases: number = 0;
    sales: number = 0;
    density: number = 0;
}
