import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { AAPensionFormComponent } from '../aa-pension-form.component';
import { DateToReadableString } from '../../../pipes/dateToReadableString.pipe';
import {AAInputNumberComponent} from "../../aa-input-number/aa-input-number.component";
import {AAComponentsModule} from "../../../aa.module";

require('../../../../modules/clientStorage.js');

describe('AA Pension Form Component', () => {
  let comp: AAPensionFormComponent;
  let fixture : ComponentFixture<AAPensionFormComponent>;

  beforeEach(async(()  => {

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, AAComponentsModule],
      declarations: []
      // schemas:      [ NO_ERRORS_SCHEMA ]
    });

      fixture = TestBed.createComponent(AAPensionFormComponent);
      comp = fixture.componentInstance; // BannerComponent test instance

  }));

  it('should equal 1', async() => {
    expect(comp.testMethod(1)).toEqual(1);
    //done();
  });

  it('User age validation passes on false', () => {
    expect(comp.validateAge('1950-11-11', 1, 'user', 'user')).toBeFalsy();
  });

  it('Partner age validation passes on false', () => {
    expect(comp.validateAge('1995-11-11', 2, 'partner', 'partner')).toBeFalsy();
  });

});
