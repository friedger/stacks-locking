import { useState } from 'react';

import { Description, Step } from '../../components/stacking-form-step';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { Box, Input, Text, color } from '@stacks/ui';
import { useField } from 'formik';
import { CryptoAddressInput } from '../../components/crypto-address-form';

interface Props {
  editable: boolean;
  btcAddress: string;
}
export function ChoosePoolingRewardAddress({ btcAddress, editable }: Props) {
  const [field, meta, helpers] = useField('rewardAddress');
  const [showBtcAddressWarning, setShowBtcAddressWarning] = useState(btcAddress === field.onChange);
  const checkBtcAddress = (val: string) => {
    setShowBtcAddressWarning(btcAddress !== val);
  };

  return (
    <Step title="Reward address">
      <Description>
        <Text>
          Choose how you would like to receive your stacking rewards. Your pool might require to use
          your own Bitcoin address only.
        </Text>
      </Description>

      <Box position="relative" maxWidth="400px">
        <CryptoAddressInput fieldName="poxAddress" addressType="BTC" {...field}>
          {meta.touched && meta.error && (
            <ErrorLabel>
              <ErrorText>{meta.error}</ErrorText>
            </ErrorLabel>
          )}
        </CryptoAddressInput>
      </Box>
      {editable ? (
        <Box textStyle="body.small" color={color('feedback-alert')} mt="base-tight">
          Make sure you controll this BTC address. It is written on-chain and pool operators use the
          address as is.
        </Box>
      ) : (
        <Box textStyle="body.small" color={color('text-caption')} mt="base-tight">
          This is your BTC address.
        </Box>
      )}
    </Step>
  );
}
