import * as yup from 'yup';

export function stxAmountSchema() {
  return yup
    .number()
    .required('Enter an amount of STX')
    .positive('You must stack something')
    .typeError('STX amount must be a number');
}
