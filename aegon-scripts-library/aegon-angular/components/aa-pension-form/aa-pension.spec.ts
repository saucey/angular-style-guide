import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { AAPensionFormComponent } from './aa-pension-form.component';
import { AAMoneyPipe } from '../../pipes/money.pipe';
import { DateToReadableString } from '../../pipes/dateToReadableString.pipe';

require('../../../modules/clientStorage.js');

describe('AA Pension Form Component', () => {
  let comp: AAPensionFormComponent;
  let fixture : ComponentFixture<AAPensionFormComponent>;

  beforeEach(async(()  => {

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [AAPensionFormComponent, DateToReadableString, AAMoneyPipe],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
    .then(() => {

      fixture = TestBed.createComponent(AAPensionFormComponent);

      comp = fixture.componentInstance; // BannerComponent test instance
    });

  }));

  it('should equal 1', () => {
    expect(comp.testMethod(1)).toEqual(1);
  });

});
