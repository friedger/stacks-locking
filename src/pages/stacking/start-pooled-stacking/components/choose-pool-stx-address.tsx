import { CryptoAddressInput } from '../../components/crypto-address-form';
import { Description, Step } from '../../components/stacking-form-step';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { OpenExternalLinkInNewTab } from '@components/external-link';
import { Text } from '@stacks/ui';
import { useField } from 'formik';

export function ChoosePoolAddress() {
  const [field, meta] = useField('poolAddress');
  return (
    <Step title="Pool address">
      <Description>
        <Text>
          Enter the STX address of the pool with which you&apos;d like to Stack without your STX
          leaving your wallet.
        </Text>
        <Text>
          The pool will provide this address for you. Pools can have different addresses that
          correspond to particular durations.
        </Text>
        <OpenExternalLinkInNewTab href="https://stacks.co/stacking#services">
          Discover pools on stacks.co
        </OpenExternalLinkInNewTab>
      </Description>
      <CryptoAddressInput fieldName="poolAddress" placeholder="Pool address" {...field}>
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </CryptoAddressInput>
    </Step>
  );
}
