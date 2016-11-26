import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Flock } from './shared/flock.model';

@Injectable()
export class Farm {

    private flockList: Flock[] = [];

    addFlock(name: string): Flock {
        let newFlock = new Flock(name);
        this.flockList.push(newFlock);
        return newFlock;
    }

    getFlockList(): Observable<Flock[]> {
        return Observable.create((subscriber) => {
            return subscriber.next(this.flockList);
        });
    }

    constructor() {
        this.addFlock('Stado 4');
        this.addFlock('Stado 5');
        this.addFlock('Stado 6');
    }

}
