import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlockService } from '../shared/flock.service';
import { Flock } from '../shared/flock.model';

@Component({
    selector: 'app-add-flock',
    templateUrl: './add-flock.component.html',
    styleUrls: ['./add-flock.component.scss']
})
export class AddFlockComponent {

    constructor(
        private flockService: FlockService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    save(formData) {
        let flock = new Flock(formData)
        this.flockService.add(flock)
            .toPromise()
            .then(this.exit.bind(this)); // TODO redirect to new flock menu
    }

    cancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['']);
    }

}
