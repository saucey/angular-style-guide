import {Pipe, PipeTransform} from '@angular/core';
import {formatNumber} from "./input-number.component";

@Pipe({name: 'money'})
export class MoneyPipe implements PipeTransform {
  transform(value:number, roundNumber: boolean) : any {
    return formatNumber(value, !roundNumber);
  };
}
