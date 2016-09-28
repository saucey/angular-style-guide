/**
 * Reverse date string pipe.
 * Converts yyyy-mm-dd to dd-mm-yyyy.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'reverseDateString'})
export class AAReverseDateStringPipe implements PipeTransform {
  transform(value:string, args:any[]) : any {
    let bdTokens = value.split('-');
    return `${bdTokens[2]}-${bdTokens[1]}-${bdTokens[0]}`
  };
}
