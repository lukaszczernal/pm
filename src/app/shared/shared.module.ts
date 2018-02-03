import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AsideToggleDirective } from './aside.directive';
import { NAV_DROPDOWN_DIRECTIVES } from './nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './sidebar.directive';
import { DatabaseService } from './database.service';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap'; // TODO remove this dependency
import { PipesModule } from './pipes';
import { FlocksService } from 'app/shared/service/flocks.service';
import { FlockTypeService } from 'app/shared/service/flock-type.service';
import {
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule
} from '@angular/material';
import { TitleBarComponent } from 'app/title-bar/title-bar.component';

@NgModule({
    imports: [
        PipesModule,
        FormsModule,
        RouterModule,
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        NgbDatepickerModule.forRoot(), // TODO remove this dependency
        ReactiveFormsModule
    ],
    declarations: [
        TitleBarComponent,
        AsideToggleDirective, // TODO move to farm module
        NAV_DROPDOWN_DIRECTIVES, // TODO move to farm module
        SIDEBAR_TOGGLE_DIRECTIVES // TODO move to farm module
    ],
    exports: [
        PipesModule,
        FormsModule,
        RouterModule,
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        TitleBarComponent,
        MatDatepickerModule,
        NgbDatepickerModule, // TODO remove this dependency
        ReactiveFormsModule,
        AsideToggleDirective,
        NAV_DROPDOWN_DIRECTIVES,
        SIDEBAR_TOGGLE_DIRECTIVES
    ]
})
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [
                FlockTypeService,
                DatabaseService,
                FlocksService
            ]
        };
    }
}
