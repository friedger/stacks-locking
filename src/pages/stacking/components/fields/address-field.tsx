import { TextInput, TextInputProps } from '@mantine/core';
import { useField } from 'formik';

export function AddressField(props: TextInputProps) {
  const [field, meta] = useField('poolAddress');
  return (
    <>
      <TextInput
        maw="400px"
        styles={{ input: { fontFamily: 'monospace' } }}
        error={meta.touched && meta.error}
        {...props}
        {...field}
      />
    </>
  );
}
