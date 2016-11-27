import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Farm } from '../farm.service';

@Component({
    selector: 'app-add-flock',
    templateUrl: './add-flock.component.html',
    styleUrls: ['./add-flock.component.scss']
})
export class AddFlockComponent {

    constructor(
        private farm: Farm,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    save(data) {
        let newFlock = this.farm.addFlock(data.flockName);
        this.router.navigate(['../flock', newFlock.id], {relativeTo: this.activatedRoute});
    }

    cancel() {
        this.router.navigate(['']);
    }

}
