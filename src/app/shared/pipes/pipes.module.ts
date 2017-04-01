import { NgModule } from '@angular/core';
import { ZeroDash } from './zero-dash.pipe';
import { Unit } from './unit.pipe';

@NgModule({
    declarations: [
        ZeroDash,
        Unit
    ],
    exports: [
        ZeroDash,
        Unit
    ]
})
export class PipesModule { } //TODO all pipes instantiated multiple times
