import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AAPensionFormComponent } from './aa-pension-form.component';
import { AAMoneyPipe } from '../../pipes/money.pipe';
import { AAInputNumberComponent } from '../aa-input-number/aa-input-number.component';
import {
  Component, OnInit, ElementRef, trigger, state, animate, transition, style, SimpleChanges
} from '@angular/core';


describe('AppComponent', () => {
  let comp: AAPensionFormComponent;
  let fixture : ComponentFixture<AAPensionFormComponent>;

  beforeEach(() => {

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      // imports: [InputNumberComponent],
      declarations: [AAPensionFormComponent, AAMoneyPipe, AAInputNumberComponent]
    });

    fixture = TestBed.createComponent(AAPensionFormComponent);

    comp = fixture.componentInstance; // BannerComponent test instance

  });

  it('should equal 1', () => {
    // expect(comp.testMethod(1)).toEqual(1);
  });

});
