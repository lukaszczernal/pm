import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlockService } from '../../flock/shared/flock.service';
import { Flock } from '../../flock/shared/flock.model';

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

    save(data) {
        let newFlock = this.flockService.add(new Flock(data.flockName));
        newFlock
            .subscribe(res => console.log('res', res));
        // this.router.navigate(['../flock', newFlock.id], {relativeTo: this.activatedRoute});
    }

    cancel() {
        this.router.navigate(['']);
    }

}
