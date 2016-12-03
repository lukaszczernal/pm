export class Flock {
    public static TABLE_NAME = 'flock';

    public static parseRows(rows: Object[]): Flock[] {
        let accounts: Flock[] = [];
        for (let row of rows) {
            accounts.push(new Flock(
                row['name'],
                row['id']
            ));
        }
        return accounts;
    }

    constructor(public name: string,
                public id?: number) {
    }

    toRow(): Object {
        return Object.assign({}, this);
    }
}
