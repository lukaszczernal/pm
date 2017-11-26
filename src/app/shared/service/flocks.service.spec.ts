/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FlocksService } from './flocks.service';

describe('Service: Flock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlocksService]
    });
  });

  it('should ...', inject([FlocksService], (service: FlocksService) => {
    expect(service).toBeTruthy();
  }));
});
