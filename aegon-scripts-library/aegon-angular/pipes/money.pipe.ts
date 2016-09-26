/**
 * Money pipe.
 * Formats numbers as money for nice display
 */
import {Pipe, PipeTransform} from '@angular/core';
import {formatNumber} from "../lib/format";

@Pipe({name: 'money'})
// Arguments: [round #digits]
export class AAMoneyPipe implements PipeTransform {
  transform(value:number, args:any[]) : any {
    var roundResult:boolean = args && args.length > 0 && args[0] === true;
    if (value === undefined) {
      return;
    }
    // Round result?
    if (roundResult) {
      value = Math.round(value);
    }
    return formatNumber(value, !roundResult);
  };
}
