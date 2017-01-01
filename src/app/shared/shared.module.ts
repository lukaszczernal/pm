import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AsideToggleDirective } from './aside.directive';
import { BreadcrumbsComponent } from './breadcrumb.component';
import { NAV_DROPDOWN_DIRECTIVES } from './nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './sidebar.directive';
import { DatabaseService } from './database.service';

@NgModule({
  imports: [
    FormsModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
      AsideToggleDirective,
      BreadcrumbsComponent,
      NAV_DROPDOWN_DIRECTIVES,
      SIDEBAR_TOGGLE_DIRECTIVES
  ],
  exports: [
      FormsModule,
      CommonModule,
      ReactiveFormsModule,
      AsideToggleDirective,
      BreadcrumbsComponent,
      NAV_DROPDOWN_DIRECTIVES,
      SIDEBAR_TOGGLE_DIRECTIVES
  ]
})
export class SharedModule {
    static forRoot() {
        return {
            ngModule: SharedModule,
            providers: [ DatabaseService ]
        };
    }
}
