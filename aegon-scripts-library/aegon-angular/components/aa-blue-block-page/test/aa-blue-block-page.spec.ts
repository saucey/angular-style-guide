import {ComponentFixture, TestBed, async } from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AABlueBlockPageComponent } from './aa-blue-block-page.component';
require('../../../modules/clientStorage');

describe('AA Blue Block Page Component', () => {
  let comp: AABlueBlockPageComponent;
  let fixture : ComponentFixture<AABlueBlockPageComponent>;
  let testPensionInfo = {
    "pensionAmount" : 25000,
    "pensionLocation" : 0,
    "havePartner" : "true",
    "insurablePartner" : "true",
    "birthDate" : "1950-01-01",
    "birthDateOfPartner" : "1950-02-02",
    "startingDate" : "2016-12-01",    
  }

  beforeEach(async(()  => {

    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [AABlueBlockPageComponent],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents()
    .then(() => {

      fixture = TestBed.createComponent(AABlueBlockPageComponent);

      comp = fixture.componentInstance; // BannerComponent test instance
    });

  }));

  it('should return an empty pension info object', () => {
    expect(comp.getPensionInfo()).toEqual(jasmine.any(Object));
  });

  it('should accept object', () => {
    expect(comp.isPensionInfoAvailable(testPensionInfo)).toBeTruthy();
  });  

  it('should not accept object', () => {
    expect(comp.isPensionInfoAvailable({})).not.toBeTruthy();
  });  

  it('should agree pension location is Aegon only', () => {
    expect(comp.isPensionLocationAegon(0)).toBeTruthy();
  });

  it('should not agree pension location is Aegon because it is from another insurance', () => {
    expect(comp.isPensionLocationAegon(1)).not.toBeTruthy();
  });   

  it('should agree pension location is Aegon and other insurance', () => {
    expect(comp.isPensionLocationAegon(2)).toBeTruthy();
  });   
});