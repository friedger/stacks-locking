import { TextInput, TextInputProps } from '@mantine/core';
import { useField } from 'formik';

export function AmountField(props: TextInputProps) {
  const [field, meta] = useField('amountStx');
  return (
    <>
      <TextInput maw="400px" error={meta.touched && meta.error} {...props} {...field} />
    </>
  );
}
