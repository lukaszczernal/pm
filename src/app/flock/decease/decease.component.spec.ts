/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DeceaseComponent } from './decease.component';

describe('DeceaseComponent', () => {
  let component: DeceaseComponent;
  let fixture: ComponentFixture<DeceaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeceaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeceaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
