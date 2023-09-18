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
    return 'Value must be "X" or "O"';
  }
}

export function isMark(validationOptions?: ValidationOptions) {
  return function (object: string, propertyName: string) {
    registerDecorator({
      name: 'isMark',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CustomValueConstraint,
    });
  };
}
