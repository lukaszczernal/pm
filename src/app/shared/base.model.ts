import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class BaseModel {

    constructor(data) {
        this.update(data);
    }

    update(data): any {
        return Object.assign(this, data);
    }

    toRow(): Object {
        return Object.assign({}, this);
    }

    protected toNgbDate(dateField: Date): NgbDateStruct {
        if (dateField) {
            return {
                year: dateField.getFullYear(),
                month: dateField.getMonth() + 1,
                day: dateField.getDate()
            };
        } else {
            return undefined;
        }
    }

    protected fromNgbDate(data: NgbDateStruct): Date {
        return new Date(data.year, data.month - 1, data.day);
    }

}
