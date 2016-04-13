import {Pipe, PipeTransform} from 'angular2/core';
import {formatNumber} from "./input-money.component";

@Pipe({name: 'money'})
export class MoneyPipe implements PipeTransform {
  transform(value:number, args:string[]) : any {
    if (value) {
      return formatNumber(value);
    }
  };
}
