import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FlocksService } from '../../farm/shared/flocks.service';
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
        private flocksService: FlocksService
    ) {}

    ngOnInit() {
        this.form = this.buildForm();

        this.route.params
            .map(params => params['id'])
            .switchMap(id => this.flocksService.get(id))
            .subscribe(flock => {
                this.flock = flock;
                this.form.patchValue(flock);
            });

        this.flocksService.update
            .subscribe(() => this.exit()); // TODO this should be run after succesfull DB update

    }

    onSubmit(formData: FormData) {
        this.flock.closeDate = formData.closeDate;
        this.flocksService.update.next(this.flock);
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
