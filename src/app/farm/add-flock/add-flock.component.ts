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
    ) {
        this.flockService.add
            .subscribe(() => this.exit());
    }

    save(formData) {
        let flock = new Flock(formData);
        this.flockService.add.next(flock);
    }

    cancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['']); // TODO Navigate to new flock overview page
    }

}
