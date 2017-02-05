import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class NgbJsDateParserFormatter {
  parse(value: string): Date {
    console.log('dateParts value', value);
    if (value) {
      const dateParts = value.trim().split('-');
      // if (dateParts.length === 1 && isNumber(dateParts[0])) {
      //   return {year: toInteger(dateParts[0]), month: null, day: null};
      // } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
      //   return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null};
      // if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
      //   return {year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2])};
      // }
      return new Date(Number(dateParts[0]), Number(dateParts[1]), Number(dateParts[2]));

    }
    return null;
  }

  format(date: Date): string {
    console.log('format date', date);
    return '9999-99-99';
    // return date ?
    //     `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
    //     '';
  }
}
