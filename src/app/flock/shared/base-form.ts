import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

export class BaseForm {

    protected submit: Subject<any> = new Subject();

    constructor(
        protected router: Router,
        protected route: ActivatedRoute
    ) {}

    onSubmit(form: any) {
        this.submit.next(form);
    }

    onCancel() {
        this.exit();
    }

    errorMsgVisible(field): boolean {
        if (field) {
            return field.invalid && field.dirty;
        } else {
            return false;
        }
    }

    protected exit() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    protected showValidationMsg(controls) {
        for (let key in controls) {
            if (controls.hasOwnProperty(key)) {
                let control = controls[key];
                control.markAsDirty();
                if (control instanceof FormGroup) {
                    this.showValidationMsg(control.controls);
                }
            }
        }
    }

}
