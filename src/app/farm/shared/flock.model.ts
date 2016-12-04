export class Flock {
    public static TABLE_NAME = 'flock';

    public static parseRows(rows: Object[]): Flock[] {
        let flocks: Flock[] = [];
        for (let row of rows) {
            flocks.push(new Flock(
                row['name'],
                row['id']
            ));
        }
        return flocks;
    }

    constructor(public name: string,
                public id?: number) {
    }

    toRow(): Object {
        return Object.assign({}, this);
    }
}
