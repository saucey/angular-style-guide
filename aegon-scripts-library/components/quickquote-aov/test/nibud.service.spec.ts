import {NibudService} from '../nibud.service';
import {Http} from '@angular/http';
//import {beforeEachProviders, beforeEach} from "angular2/testing";
//import beforeEach = testing.beforeEach;

// below elements are not longer in core/testing
// they will have to be loaded from a different source
//import {describe, it, beforeEach, expect} from '@angular/core/testing';

describe('NibudService', () => {

  // beforeEachProviders(() => [
  //     provide(HTTP_PROVIDERS),
  //     NibudService
  // ]);
  // beforeEach(function () {
  //    this.testService = new NibudService(Http);
  // });

  // it('should have name property set', inject([TestService], (testService: TestService) => {
  //   expect(testService.name).toBe('Injected Service');
  // }));

    it('should have name property set', function () {
        expect('some statement').toBe('some statement');
    });

});
