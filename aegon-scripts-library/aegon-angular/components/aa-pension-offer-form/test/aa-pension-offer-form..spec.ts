import {ComponentFixture, TestBed, async } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AAPensionOfferFormComponent} from "../aa-pension-offer-form.component";
import {AAMoneyPipe} from "../../../pipes/money.pipe";

require('../../../../modules/clientStorage');

describe('AA Pension Offer Form Component', () => {
  let comp: AAPensionOfferFormComponent;
  let fixture : ComponentFixture<AAPensionOfferFormComponent>;

  let mockString: string = 'value';
  let mockObject: Object = {key: 'value'};
  let mockEmptyObject: Object = {};

  beforeEach(async(()  => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [AAPensionOfferFormComponent, AAMoneyPipe],
      schemas:      [NO_ERRORS_SCHEMA]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AAPensionOfferFormComponent);
      comp = fixture.componentInstance;
    });
  }));

  xit('should return an empty pension info object', () => {
    expect(comp.getSessionStorage(mockString)).toEqual(jasmine.any(Object));
  });

  xit('should accept data type', () => {
    expect(comp.isString(mockString)).toBeTruthy();
  });

  xit('should not accept data type', () => {
    expect(comp.isString(mockObject)).toBeFalsy();
  });

  xit('should accept object', () => {
    expect(comp.isObjectAvailable(mockObject)).toBeTruthy();
  });

  xit('should not accept object', () => {
    expect(comp.isObjectAvailable(mockEmptyObject)).toBeFalsy();
  });

  xit('should not accept object', () => {
    expect(comp.isObjectAvailable(mockString)).toBeFalsy();
  });
});
