import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AsideToggleDirective } from './aside.directive';
import { BreadcrumbsComponent } from './breadcrumb.component';
import { NAV_DROPDOWN_DIRECTIVES } from './nav-dropdown.directive';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './sidebar.directive';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
      AsideToggleDirective,
      BreadcrumbsComponent,
      NAV_DROPDOWN_DIRECTIVES,
      SIDEBAR_TOGGLE_DIRECTIVES
  ],
  exports: [
      AsideToggleDirective,
      BreadcrumbsComponent,
      NAV_DROPDOWN_DIRECTIVES,
      SIDEBAR_TOGGLE_DIRECTIVES
  ]
})
export class SharedModule { }
