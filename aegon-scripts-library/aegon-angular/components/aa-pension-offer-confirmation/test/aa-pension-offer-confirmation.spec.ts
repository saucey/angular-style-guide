import {ComponentFixture, TestBed, async } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AAPensionOfferConfirmationComponent} from "../aa-pension-offer-confirmation.component";
import {AAMoneyPipe} from "../../../pipes/money.pipe";

require('../../../../modules/clientStorage');

describe('AA Pension Offer Confirmation Component', () => {
  let comp: AAPensionOfferConfirmationComponent;
  let fixture : ComponentFixture<AAPensionOfferConfirmationComponent>;

  let mockString: string = 'value';
  let mockObject: Object = {key: 'value'};
  let mockEmptyObject: Object = {};  

  beforeEach(async(()  => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [AAPensionOfferConfirmationComponent, AAMoneyPipe],
      schemas:      [NO_ERRORS_SCHEMA]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AAPensionOfferConfirmationComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should return an empty pension info object', () => {
    expect(comp.getSessionStorage(mockString)).toEqual(jasmine.any(Object));
  });

  it('should accept data type', () => {
    expect(comp.isString(mockString)).toBeTruthy();
  });     

  it('should not accept data type', () => {
    expect(comp.isString(mockObject)).toBeFalsy();
  });     

  it('should accept object', () => {
    expect(comp.isObjectAvailable(mockObject)).toBeTruthy();
  }); 

  it('should not accept object', () => {
    expect(comp.isObjectAvailable(mockEmptyObject)).toBeFalsy();
  });        

  it('should not accept object', () => {
    expect(comp.isObjectAvailable(mockString)).toBeFalsy();
  });      
});