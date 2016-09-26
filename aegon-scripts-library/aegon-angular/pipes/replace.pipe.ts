/**
 * Replace pipe.
 * Replaces parts in a string.
 * Usage: someValue | replace : {'hi': something, 'ola': 'hi'}
 *        if someValue contains hi or ola then these will be replaced.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'replace'})
export class AAReplacePipe implements PipeTransform {
  transform(value:string, args:any[]) : any {
    if (args.length > 0 && args[0]) {
      var result = '' + value;

      for (let key in args[0]) {
        result = result.replace(key, '' + args[0][key]);
      }

      return result;
    }

    return value;
  };
}
