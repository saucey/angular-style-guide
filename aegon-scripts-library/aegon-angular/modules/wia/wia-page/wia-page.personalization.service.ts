import { Injectable } from "@angular/core";
import { WIAInputEntity } from "./wia-input.entity";
import { WiaPageProductsService } from "./wia-page.products.service";

@Injectable()
export class WiaPagePersonalizationService {

  private wiaPageProductsService: WiaPageProductsService;

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

    this.wiaPageProductsService = new WiaPageProductsService();
  }

  public getUrlCode(): string {

    return window.location.hash.substr(1);
  }

  public setUrlCode(code: string): void {

    window.location.hash = code;
  }

  public getUrlConfiguration(): WIAInputEntity {

    const code = this.getUrlCode();

    if (code && code.length === 5) {
      return this.codeToInput(code);
    }

    return;
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

    const products = this.wiaPageProductsService.getProducts();

    const to36 = number => (+number).toString(35); // leave 'z' free to replace 'o's later
    const code = [];
    let substring = '';

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
    const WGA_EXCED_PROD: any = products.find(el => el.id === 'WGA_EXCED');
    if (WGA_EXCED) {
      substring += WGA_EXCED_PROD.attrs[0].options.findIndex(attr => attr.value === WGA_EXCED.attrs[0].value) + 1; //+1, because 0 is off
    } else {
      substring += 0;
    }

    //IVA_EXCED
    const IVA_EXCED: any = input.products.find(el => el.id === 'IVA_EXCED');
    const IVA_EXCED_PROD: any = products.find(el => el.id === 'IVA_EXCED');
    if (IVA_EXCED) {
      substring += IVA_EXCED_PROD.attrs[0].options.findIndex(attr => attr.value === IVA_EXCED.attrs[0].value) + 1; //+1, because 0 is off
    } else {
      substring += 0;
    }

    code.push(to36(substring));

    substring = '';

    //WGA_AANV
    const WGA_AANV = input.products.find(el => el.id === 'WGA_AANV_STANDARD');
    const WGA_AANV_LIGHT = input.products.find(el => el.id === 'WGA_AANV_LIGHT');
    const WGA_AANV_UPGRADE = input.products.find(el => el.id === 'WGA_AANV_UPGRADE');

    if (WGA_AANV) {
      substring += 1;
    } else if (WGA_AANV_LIGHT) {
      substring += 2;
    } else if (WGA_AANV_UPGRADE) {
      substring += 3;
    } else {
      substring += 0;
    }

    //35MIN
    const WIA_35MIN_BODEM = input.products.find(el => el.id === 'WIA_35MIN_BODEM');
    const WIA_35MIN: any = input.products.find(el => el.id === 'WIA_35MIN');
    const WIA_35MIN_PROD: any = products.find(el => el.id === 'WIA_35MIN');

    //IVA_EXCED
    if (WIA_35MIN_BODEM) {
      substring += 1;
    } else if (WIA_35MIN) {
      substring += WIA_35MIN_PROD.attrs[0].options.findIndex(attr => attr.value === WIA_35MIN.attrs[0].value) + 2; //+2, because 0 is off, 1 is BODEM
    } else {
      substring += 0;
    }

    code.push(to36(substring));

    return code.join('').toUpperCase().replace(/O/g, 'Z');
  }

  public codeToInput(code: string): WIAInputEntity {

    const productsMeta = this.wiaPageProductsService.getProducts();

    const to10 = number => Number.parseInt(number, 35); // leave 'z' free to replace 'o's later

    const codeChars = code.replace(/Z/g, 'O').toLowerCase().split('');

    const products = [];

    const income = this.incomeClasses[to10(codeChars[0])];
    const disability = to10(codeChars[1]) * 10;
    const usage = codeChars[2] === 'p' ? 50 : to10(codeChars[2]) * 10;
    const permDisability = codeChars[2] === 'p';

    let WGAIVA = to10(codeChars[3]).toString();
    WGAIVA = WGAIVA.length === 1 ? '0' + WGAIVA : WGAIVA;

    let WGA = +WGAIVA[0];
    let IVA = +WGAIVA[1];

    if (WGA) {
      products.push({
        id: 'WGA_EXCED',
        attrs: [
          {
            id: 'COV_RATE',
            value: productsMeta.find(e => e.id === 'WGA_EXCED').attrs[0].options[WGA - 1].value
          }
        ]
      })
    }

    if (IVA) {
      products.push({
        id: 'IVA_EXCED',
        attrs: [
          {
            id: 'COV_RATE',
            value: productsMeta.find(e => e.id === 'IVA_EXCED').attrs[0].options[IVA - 1].value
          }
        ]
      })
    }

    let AANVMIN35 = to10(codeChars[4]).toString();
    AANVMIN35 = AANVMIN35.length === 1 ? '0' + AANVMIN35 : AANVMIN35;

    let AANV = +AANVMIN35[0];
    let MIN35 = +AANVMIN35[1];

    if (AANV) {
      products.push({
        id: {
          1: 'WGA_AANV_STANDARD',
          2: 'WGA_AANV_LIGHT',
          3: 'WGA_AANV_UPGRADE'
        }[AANV],
        attrs: []
      })
    }

    if (MIN35) {
      if (MIN35 === 1) {
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
              value: productsMeta.find(e => e.id === 'WIA_35MIN').attrs[0].options[MIN35 - 2].value
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
