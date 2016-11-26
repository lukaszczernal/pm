export class Flock {

    static id: number = 0;

    id: number;
    name: string;

    constructor(name: string) {
        this.id = Flock.id++;
        this.name = name;
    }

};
