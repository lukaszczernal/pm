/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FlockService } from './flock.service';

describe('Service: Flock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlockService]
    });
  });

  it('should ...', inject([FlockService], (service: FlockService) => {
    expect(service).toBeTruthy();
  }));
});
