/**
 * Period pipe.
 * Given a number of days, returns the right period (2 week, 1 Maand, ...)
 */
import {Pipe, PipeTransform} from 'angular2/core';

@Pipe({name: 'period'})
// Arguments: [round #digits]
export class AAPeriodPipe implements PipeTransform {
  transform(value:number, args:any[]) : any {
    if (value === undefined) {
      return "";
    }
    switch (value) {
      case 7:
        return "1 week";
        break;
      case 14:
        return "2 weken";
        break;
      case 30:
        return "1 maand";
        break;
      case 90:
        return "3 maanden";
        break;
      case 365:
        return "1 jaar";
        break;
      default:
        return "1 maand";
      }
  };
}
