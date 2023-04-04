import { FormikErrors } from 'formik';

export function hasErrors<T extends object>(errors: FormikErrors<T>) {
  return Object.keys(errors).length > 0;
}
