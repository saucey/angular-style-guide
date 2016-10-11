/**
 * Reverse date string pipe.
 * Converts yyyy-mm-dd to dd-mm-yyyy.
 */
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'dateToReadableString'})
export class DateToReadableString implements PipeTransform {
  transform(value:string, args:any[]) : any {

    return new Date(value).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });

  };
}
