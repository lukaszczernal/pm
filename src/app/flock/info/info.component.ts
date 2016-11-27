import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {}

    save(data) {
        console.log('TODO save flock data and update the side panel flocks names');
        // this.router.navigate([newFlock.id], {relativeTo: this.activatedRoute});
    }

    cancel() {
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }

}
