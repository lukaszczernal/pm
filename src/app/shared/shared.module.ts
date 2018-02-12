import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AsideToggleDirective } from './aside.directive';
import { NAV_DROPDOWN_DIRECTIVES } from './nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './sidebar.directive';
import { DatabaseService } from './database.service';
import { PipesModule } from './pipes';
import { FlocksService } from 'app/shared/service/flocks.service';
import { FlockTypeService } from 'app/shared/service/flock-type.service';
import {
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTooltipModule,
} from '@angular/material';
import { TitleBarComponent } from 'app/title-bar/title-bar.component';
import { CdkTableModule } from '@angular/cdk/table';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@NgModule({
    imports: [
        PipesModule,
        FormsModule,
        RouterModule,
        CommonModule,
        MatCardModule,
        MatIconModule,
        CdkTableModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        ConfirmationDialogComponent
    ],
    declarations: [
        TitleBarComponent,
        AsideToggleDirective, // TODO move to farm module
        NAV_DROPDOWN_DIRECTIVES, // TODO move to farm module
        SIDEBAR_TOGGLE_DIRECTIVES, // TODO move to farm module
        ConfirmationDialogComponent
    ],
    exports: [
        PipesModule,
        FormsModule,
        RouterModule,
        CommonModule,
        MatCardModule,
        MatIconModule,
        CdkTableModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatTooltipModule,
        TitleBarComponent,
        MatDatepickerModule,
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
