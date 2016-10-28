import { Injectable } from "@angular/core";
import { WIAInputModel } from "./models/wia-input.model";

import {
  WGA_EXCED_Code,
  WGA_EXCED_Value,
  IVA_EXCED_Code,
  IVA_EXCED_Value,
  WGA_AANV_Code,
  WIA_35MIN_Code,
  WIA_35MIN_Value
} from "./enums/personalization.enum";
import { WiaInputUseCaseEnum } from "../wia-content/enums/wia-input-use-case.enum";

@Injectable()
export class WiaPagePersonalizationService {

  public incomeClasses = [
    5000,
    15000,
    25000,
    35000,
    45000,
    55000,
    65000,
    75000,
    85000,
    95000,
    105000,
    115000,
    125000
  ];

  constructor() {
  }


  private to36 = number => (+number).toString(35); // leave 'z' free to replace 'o's later

  public getIncomeClass(income: number): number {

    // get first index that is big enough for given income
    return this.incomeClasses.findIndex(el => el >= income);
  }

  private getIncomeFromInput(input: WIAInputModel): string {

    return this.to36(this.getIncomeClass(input.income));
  }

  private getDisabilityFromInput(input: WIAInputModel): string {

    return this.to36(~~(input.disability / 10));
  }

  private getUsageFromInput(input: WIAInputModel): string {

    if (input.permDisability) {
      return 'P'
    } else {
      return this.to36(~~(input.usage / 10))
    }
  }


  private getProductsFromInput(input: WIAInputModel): string {

    let finalString = ''; // array of final characters
    let substring = ''; // temporary variable to construct single code character from multiple digits

    //WGA_EXCED
    const WGA_EXCED: any = input.products.find(el => el.id === 'WGA_EXCED');
    substring += WGA_EXCED ? WGA_EXCED_Code[WGA_EXCED_Value[WGA_EXCED.attrs[0].value]] : 0;

    //IVA_EXCED
    const IVA_EXCED: any = input.products.find(el => el.id === 'IVA_EXCED');
    substring += IVA_EXCED ? IVA_EXCED_Code[IVA_EXCED_Value[IVA_EXCED.attrs[0].value]] : 0;

    finalString += this.to36(substring);

    substring = '';

    //WGA_AANV
    const WGA_AANV_STANDARD = input.products.find(el => el.id === 'WGA_AANV_STANDARD');
    const WGA_AANV_LIGHT = input.products.find(el => el.id === 'WGA_AANV_LIGHT');
    const WGA_AANV_UPGRADE = input.products.find(el => el.id === 'WGA_AANV_UPGRADE');

    if (WGA_AANV_STANDARD) {
      substring += WGA_AANV_Code.Standard;
    } else if (WGA_AANV_LIGHT) {
      substring += WGA_AANV_Code.Light;
    } else if (WGA_AANV_UPGRADE) {
      substring += WGA_AANV_Code.Upgrade;
    } else {
      substring += WGA_AANV_Code.Off;
    }

    //35MIN
    const WIA_35MIN_BODEM = input.products.find(el => el.id === 'WIA_35MIN_BODEM');
    const WIA_35MIN: any = input.products.find(el => el.id === 'WIA_35MIN');

    //IVA_EXCED
    if (WIA_35MIN_BODEM) {
      substring += WIA_35MIN_Value.Boden;
    } else if (WIA_35MIN) {
      substring += WIA_35MIN_Code[WIA_35MIN_Value[WIA_35MIN.attrs[0].value]];
    } else {
      substring += WIA_35MIN_Code.Off;
    }

    finalString += this.to36(substring);

    return finalString.toUpperCase().replace(/O/g, 'Z');
  }

  public inputToCode(input: WIAInputModel): string {

    return [
      this.getIncomeFromInput(input),
      this.getDisabilityFromInput(input),
      this.getUsageFromInput(input),
      this.getProductsFromInput(input)
    ].join('').toUpperCase().replace(/O/g, 'Z');
  }

  public codeToInput(code: string): WIAInputModel {

    const to10 = number => Number.parseInt(number, 35); // leave 'z' free to replace 'o's later

    const codeChars = code.replace(/Z/g, 'O').toLowerCase().split('');

    const products = [];

    // Income
    const income = this.incomeClasses[to10(codeChars[0])];

    // Disability
    const disability = to10(codeChars[1]) * 10;

    // Usage
    const usage = codeChars[2] === 'p' ? 50 : to10(codeChars[2]) * 10;

    // Permanent disability
    const permDisability = codeChars[2] === 'p';

    // Convert character to two digits number
    let WGAIVA = to10(codeChars[3]).toString();
    WGAIVA = WGAIVA.length === 1 ? '0' + WGAIVA : WGAIVA;
    let WGA = +WGAIVA[0];
    let IVA = +WGAIVA[1];

    if (WGA_EXCED_Code[WGA] !== 'Off') {
      products.push({
        id: 'WGA_EXCED',
        attrs: [
          {
            id: 'COVERAGE_RATE_WGA',
            value: WGA_EXCED_Value[WGA_EXCED_Code[WGA]]
          }
        ]
      })
    }

    if (IVA_EXCED_Code[IVA] !== 'Off') {
      products.push({
        id: 'IVA_EXCED',
        attrs: [
          {
            id: 'COVERAGE_RATE_IVA',
            value: IVA_EXCED_Value[IVA_EXCED_Code[IVA]]
          }
        ]
      })
    }

    let AANVMIN35 = to10(codeChars[4]).toString();
    AANVMIN35 = AANVMIN35.length === 1 ? '0' + AANVMIN35 : AANVMIN35;

    let AANV = +AANVMIN35[0];
    let MIN35 = +AANVMIN35[1];

    if (WGA_AANV_Code[AANV] !== 'Off') {
      products.push({
        id: {
          [WGA_AANV_Code.Standard]: 'WGA_AANV_STANDARD',
          [WGA_AANV_Code.Light]: 'WGA_AANV_LIGHT',
          [WGA_AANV_Code.Upgrade]: 'WGA_AANV_UPGRADE'
        }[AANV],
        attrs: []
      })
    }

    if (WIA_35MIN_Code[MIN35] !== 'Off') {
      if (WIA_35MIN_Code[MIN35] === 'Boden') {
        products.push({
          id: 'WIA_35MIN_BODEM',
          attrs: []
        })
      } else {

        products.push({
          id: 'WIA_35MIN',
          attrs: [
            {
              id: 'BENEFIT_PERIOD',
              value: WIA_35MIN_Value[WIA_35MIN_Code[MIN35]]
            }
          ]
        })
      }
    }

    return {
      useCase: WiaInputUseCaseEnum.PARTICIPANT,
      income,
      disability,
      usage,
      permDisability,
      products,
      productsIds: products.map(e => e.id)
    };
  }
}
