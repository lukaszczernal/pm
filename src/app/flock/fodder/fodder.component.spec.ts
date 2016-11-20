/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FodderComponent } from './fodder.component';

describe('FodderComponent', () => {
  let component: FodderComponent;
  let fixture: ComponentFixture<FodderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FodderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FodderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
