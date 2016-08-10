import {Pipe, PipeTransform} from 'angular2/core';
import {formatNumber} from "./input-number.component";

@Pipe({name: 'money'})
export class MoneyPipe implements PipeTransform {
  transform(value:number, args:string[]) : any {
    return formatNumber(value);
  };
}
