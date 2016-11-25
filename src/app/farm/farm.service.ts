import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Flock } from './shared/flock.model';

@Injectable()
export class Farm {

    private flockList: Flock[] = [];

    addFlock(data: Flock) {
        this.flockList.push(new Flock(data));
    }

    getFlockList(): Observable<Flock[]> {
        return Observable.create((subscriber) => {
            return subscriber.next(this.flockList);
        });
    }

    constructor() {
        this.addFlock({ id: 4, title: 'Stado 4' });
        this.addFlock({ id: 5, title: 'Stado 5' });
        this.addFlock({ id: 6, title: 'Stado 6' });
    }

}
