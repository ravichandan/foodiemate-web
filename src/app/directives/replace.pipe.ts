import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
  standalone: true,
})
export class ReplacePipe implements PipeTransform {
  transform(value: string, regexValue: string, replaceValue: any): any {
    if (!replaceValue) replaceValue = ''; // value;
    let regex = new RegExp(regexValue, 'g');
    const resp = value.replace(regex, replaceValue);
    return resp;
  }
}
