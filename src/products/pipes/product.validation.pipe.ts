import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ProductValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log('value', value);
    console.log('metadata', metadata);

    return value;
    throw new Error('Method not implemented.');
  }
}
