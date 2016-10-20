import { Injectable } from "@angular/core";
import { WIAInputEntity } from "./models/wia-input.entity";

import {
  WGA_EXCED_Code,
  WGA_EXCED_Value,
  IVA_EXCED_Code,
  IVA_EXCED_Value,
  WGA_AANV_Code,
  WIA_35MIN_Code,
  WIA_35MIN_Value
} from "./models/personalization";

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

  public getUrlCode(): string {
    return window.location.hash.substr(1);
  }

  public setUrlCode(code: string): void {
    window.location.hash = code;
  }

  public getUrlConfiguration(): WIAInputEntity {

    const code = this.getUrlCode();
    return code && code.length === 5 ? this.codeToInput(code) : null;
  }

  public setUrlConfiguration(configuration: WIAInputEntity): void {

    const code = this.inputToCode(configuration);
    this.setUrlCode(code);
  }

  public getIncomeClass(income: number): number {

    // get first index that is big enough for given income
    return this.incomeClasses.findIndex(el => el >= income);
  }

  public inputToCode(input: WIAInputEntity): string {

    const to36 = number => (+number).toString(35); // leave 'z' free to replace 'o's later
    const code = []; // array of final code elements
    let substring = ''; // temporary variable to construct single code character from multiple digits

    //income
    code.push(to36(this.getIncomeClass(input.income)));

    //disability
    code.push(to36(~~(input.disability / 10)));

    //usage
    if (input.permDisability) {
      code.push('P');
    } else {
      code.push(to36(~~(input.usage / 10)));
    }

    //WGA_EXCED
    const WGA_EXCED: any = input.products.find(el => el.id === 'WGA_EXCED');
    substring += WGA_EXCED ? WGA_EXCED_Code[WGA_EXCED_Value[WGA_EXCED.attrs[0].value]] : 0;

    //IVA_EXCED
    const IVA_EXCED: any = input.products.find(el => el.id === 'IVA_EXCED');
    substring += IVA_EXCED ? IVA_EXCED_Code[IVA_EXCED_Value[IVA_EXCED.attrs[0].value]] : 0;

    code.push(to36(substring));

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

    code.push(to36(substring));

    return code.join('').toUpperCase().replace(/O/g, 'Z');
  }

  public codeToInput(code: string): WIAInputEntity {

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
            id: 'COV_RATE',
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
            id: 'COV_RATE',
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
              id: 'BEN_PERIOD',
              value: WIA_35MIN_Value[WIA_35MIN_Code[MIN35]]
            }
          ]
        })
      }
    }

    return {
      income,
      disability,
      usage,
      permDisability,
      products,
      productsIds: products.map(e => e.id)
    };
  }
}
