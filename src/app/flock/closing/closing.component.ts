import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlockService } from '../../farm/shared/flock.service';
import { Flock } from '../../farm/shared/flock.model';

@Component({
    selector: 'app-closing',
    templateUrl: './closing.component.html',
    styleUrls: ['./closing.component.scss']
})
export class ClosingComponent implements OnInit {

    public form: FormGroup;
    private flock: Flock;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private flockService: FlockService
    ) {}

    ngOnInit() {
        this.form = this.buildForm();

        this.route.params
            .map(params => params['id'])
            .switchMap(id => this.flockService.get(id))
            .subscribe(flock => {
                this.flock = flock;
                this.form.patchValue(flock);
            });
    }

    onSubmit(formData: FormData) {
        this.flock.closeDate = formData.closeDate;
        this.flockService.update(this.flock)
            .toPromise()
            .then(this.exit.bind(this));
    }

    onCancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    private buildForm() {
        return this.formBuilder.group({
            id: null,
            closeDate: new Date()
        } as FormData);
    }

}

interface FormData {
    id: number;
    closeDate: Date;
}
