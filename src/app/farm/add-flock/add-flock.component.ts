import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';

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
        this.flocksService.update
            .subscribe(() => this.exit());
    }

    save(formData) {
        let flock = new Flock(formData);
        this.flocksService.update.next(flock);
    }

    cancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['']); // TODO Navigate to new flock overview page
    }

}
