/**
 * Period pipe.
 * Given a number of days, returns the right period (2 week, 1 Maand, ...)
 */
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'period'})
// Arguments: [round #digits]
export class AAPeriodPipe implements PipeTransform {
  transform(value:number, args:any[]) : any {
    var res:string = "";
    if (value === undefined) {
      return "";
    }
    switch (value) {
      case 7:
        res =  "1 week";
        break;
      case 14:
        res =  "2 weken";
        break;
      case 30:
        res =  "1 maand";
        break;
      case 90:
        res =  "3 maanden";
        break;
      case 365:
        res =  "1 jaar";
        break;
      default:
        res =  "1 maand";
      }

      return res;
  };
}
