import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { AAPensionFormComponent } from '../aa-pension-form.component';
import { DateToReadableString } from '../../../pipes/dateToReadableString.pipe';
import {AAInputNumberComponent} from "../../aa-input-number/aa-input-number.component";
import {AAComponentsModule} from "../../../aa.module";

require('../../../../modules/clientStorage.js');

describe('AA Pension Form Component', () => {

  let comp: AAPensionFormComponent;
  let comp2: AAPensionFormComponent;
  let comp3: AAPensionFormComponent;

  let fixture : ComponentFixture<AAPensionFormComponent>;

  beforeEach(()  => {

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, AAComponentsModule],
      declarations: [],
      schemas:      [ NO_ERRORS_SCHEMA ]
    });

      fixture = TestBed.createComponent(AAPensionFormComponent);

      comp = fixture.componentInstance; // BannerComponent test instance

  });


  it('should equal 1',() => {
    expect(comp.testMethod(1)).toEqual(1);
  });

  it('User age validation passes on false', () => {
    expect(comp.validateAge('1950-11-11', 1, 'user', 'user')).toBeFalsy();
  });

  it('Partner age validation passes on false', () => {
    expect(comp.validateAge('1995-11-11', 2, 'partner', 'partner')).toBeFalsy();
  });

  it('should accept the value of 25.000', () => {

    comp.pension = {
      pensionAmount: 25000
    };

    expect(comp.isInValidAmount()).toBe(false);
  });

  it('should accept the value of 99.999.999', () => {

    comp.pension = {
      pensionAmount: 99999999
    };

    expect(comp.isInValidAmount()).toBe(false)
  });

  it('should show error message for value 24.499', () => {

    comp.pension = {
      pensionAmount: 24499
    };

    expect(comp.isInValidAmount()).toBe(true)
  });

  it('should show error message for value empty', () => {

    comp.pension = {
      pensionAmount: ''
    };

    expect(comp.isInValidAmount()).toBe(true)
  });


});
