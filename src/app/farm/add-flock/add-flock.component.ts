import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlocksService } from '../shared/flocks.service';
import { Flock } from '../shared/flock.model';

@Component({
    selector: 'app-add-flock',
    templateUrl: './add-flock.component.html',
    styleUrls: ['./add-flock.component.scss']
})
export class AddFlockComponent {

    constructor(
        private flocksService: FlocksService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.flocksService.add
            .subscribe(() => this.exit());
    }

    save(formData) {
        let flock = new Flock(formData);
        this.flocksService.add.next(flock);
    }

    cancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['']); // TODO Navigate to new flock overview page
    }

}
