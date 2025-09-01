import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByValue'
})
export class FilterByValuePipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    if (!items) return [];
    if (!field || !value) return items;

    return items.filter(item => item[field] === value);
  }
}