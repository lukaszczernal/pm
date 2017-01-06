import * as lf from 'lovefield';

export class Flock {

    static TABLE_NAME = 'Flock';

    type: number;
    coopSize: number;
    coopName: string;
    name: string;
    createDate: Date = new Date();
    closeDate: Date = new Date(0);
    id: number;

    public static parseRows(rows: Object[]): Flock[] { // TOOD move to base model
        let flocks: Flock[] = [];
        for (let row of rows) {
            flocks.push(new Flock(row));
        }
        return flocks;
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(Flock.TABLE_NAME)
            .addColumn('closeDate', lf.Type.DATE_TIME)
            .addColumn('createDate', lf.Type.DATE_TIME)
            .addColumn('type', lf.Type.INTEGER)
            .addColumn('coopSize', lf.Type.STRING)
            .addColumn('coopName', lf.Type.STRING)
            .addColumn('name', lf.Type.STRING)
            .addColumn('id', lf.Type.INTEGER)
            .addNullable([
                'coopName'
            ])
            .addForeignKey('fk_type', {
                local: 'type',
                ref: 'FlockType.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

    constructor(data: {}) { // TODO move to base
        Object.assign(this, data);
        this.type = Number(this.type);
    }

    isActive(): boolean {
        return this.closeDate <= this.createDate;
    }

    update(data: any) { // TODO move to base
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                console.log('key', key, 'value', data[key]);
                this[key] = data[key];
            }
        }
        return this;
    }

    toRow(): Object {
        return Object.assign({}, this);
    }
}
