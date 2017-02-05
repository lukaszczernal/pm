/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockSalesListComponent } from './flock-sales-list.component';

describe('FlockSalesListComponent', () => {
  let component: FlockSalesListComponent;
  let fixture: ComponentFixture<FlockSalesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockSalesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockSalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
