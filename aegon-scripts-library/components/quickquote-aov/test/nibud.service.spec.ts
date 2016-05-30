import {NibudService} from '../nibud.service';
import {HTTP_PROVIDERS, Http} from 'angular2/http';
//import {beforeEachProviders, beforeEach} from "angular2/testing";
//import beforeEach = testing.beforeEach;
import {describe, it, beforeEach, expect} from 'angular2/testing';

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
