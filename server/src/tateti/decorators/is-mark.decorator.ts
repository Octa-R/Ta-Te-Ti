import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'mark', async: false })
export class CustomValueConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return value === 'X' || value === 'O';
  }

  defaultMessage() {
    return 'El valor debe ser "X" o "O"';
  }
}

export function isMark(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isMark',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomValueConstraint,
    });
  };
}
