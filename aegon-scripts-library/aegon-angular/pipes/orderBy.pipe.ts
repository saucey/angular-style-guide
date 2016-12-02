
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderBy', pure: false})

export class OrderBy implements PipeTransform {

  transform(list: Array<Object>, ...args): any {

    let objKey = args[0],
      sortDirection = args[1];

    if (-1 !== objKey.indexOf('.')) {
      objKey = objKey.split('.');
    }

    if (Array.isArray(list) && list.length > 0) {

      if (sortDirection === 'ASC') {
        return list.sort(function (a, b) {
          let x = OrderBy.prototype.extractValue(a, objKey),
            y = OrderBy.prototype.extractValue(b, objKey);

          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });

      } else {
        return list.sort(function (a, b) {
          let x = OrderBy.prototype.extractValue(a, objKey),
            y = OrderBy.prototype.extractValue(b, objKey);

          return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
      }
    }
  }

  private extractValue(obj, parts) {
    let searchedValue;

    if (Array.isArray(parts)) {
      searchedValue = obj[parts[0]][parts[1]];
    } else {
      searchedValue = obj[parts];
    }

    if (searchedValue !== "" && !isNaN(searchedValue/1)) {
      searchedValue = parseInt(searchedValue);
    }
    return searchedValue;
  }
}
