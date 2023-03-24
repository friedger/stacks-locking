import { forwardRef } from 'react';

import { Input, InputProps } from '@stacks/ui';
import { useField } from 'formik';

interface CryptoAddressInputProps extends Omit<InputProps, 'form'> {
  fieldName: string;
  addressType?: 'BTC' | 'STX';
}

export const CryptoAddressInput = forwardRef<HTMLInputElement, CryptoAddressInputProps>(
  (props, ref) => {
    const { fieldName, children, addressType, ...rest } = props;
    const [field] = useField(fieldName);
    return (
      <>
        <Input
          id={fieldName}
          name={fieldName}
          mt="loose"
          maxWidth="400px"
          fontFamily={field?.value?.length ? 'monospace' : 'unset'}
          ref={ref}
          placeholder={
            addressType === 'BTC'
              ? 'Bitcoin address (Legacy, Native SegWit or Taproot)'
              : addressType === 'STX'
              ? 'Stacks address'
              : undefined
          }
          {...rest}
        />
        {children}
      </>
    );
  }
);
CryptoAddressInput.displayName = 'CryptoAddressInput';
