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

}
