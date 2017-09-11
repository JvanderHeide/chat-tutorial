import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toColor'
})
export class ToColorPipe implements PipeTransform {


  transform(value: String, args?: any): any {
    if(!value) return value;
    
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = '#';
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  }

}
