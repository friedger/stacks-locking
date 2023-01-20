import { TextInput, TextInputProps } from '@mantine/core';
import { useField } from 'formik';

interface Props extends TextInputProps {
  name: string;
}
export function AddressField(props: Props) {
  const [field, meta] = useField(props.name);
  console.log('ARY meta', meta);
  return (
    <>
      <TextInput
        maw="400px"
        styles={{ input: { fontFamily: 'monospace' } }}
        error={meta.touched && meta.error}
        {...field}
        {...props}
      />
    </>
  );
}
