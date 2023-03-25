import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { color, Text } from '@stacks/ui';
import { useField } from 'formik';
import { CryptoAddressInput } from '../../components/crypto-address-form';

export function CustomPoolAddressInput() {
  const [field, meta] = useField('poolAddress');
  return (
    <>
      <Text
        textStyle="body.small"
        color={color('text-caption')}
        mt="tight"
        display="inline-block"
        lineHeight="18px"
      >
        The pool will provide this address for you.
      </Text>
      <CryptoAddressInput
        fieldName="poolAddress"
        addressType="STX"
        placeholder="Pool address"
        {...field}
      >
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </CryptoAddressInput>
    </>
  );
}
