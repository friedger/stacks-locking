import { Description, Step } from '../../../components/stacking-form-step';
import { ErrorAlert } from '@components/error-alert';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useGetPoxOperationInfo } from '@components/stacking-client-provider/stacking-client-provider';
import { Spinner, Text } from '@stacks/ui';
import { useField } from 'formik';
import { CryptoAddressInput } from 'src/pages/stacking/components/crypto-address-form';

export function PoxAddress() {
  const [field, meta] = useField('poxAddress');
  const q = useGetPoxOperationInfo();

  if (q.isLoading) return <Spinner />;
  if (q.isError || !q.data) {
    const id = 'e69b0abe-495d-4587-9693-8bd4541dddaf';
    const msg = 'Failed to establish current PoX period.';
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  const errors = meta.error ? (
    <ErrorLabel maxWidth="430px">
      <ErrorText lineHeight="18px">{meta.error}</ErrorText>
    </ErrorLabel>
  ) : null;

  return (
    <>
      <Step title="Bitcoin address">
        <Description>
          <Text>Enter the Bitcoin address where you&apos;d like to receive your rewards.</Text>
        </Description>
        <CryptoAddressInput fieldName="poxAddress" addressType="BTC" {...field}>
          {meta.touched && errors}
        </CryptoAddressInput>
      </Step>
    </>
  );
}
