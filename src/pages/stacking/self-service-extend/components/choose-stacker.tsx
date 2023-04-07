import { Box, Input, Text } from '@stacks/ui';
import { useField } from 'formik';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { Hr } from '@components/hr';
import { useNetwork } from '@components/network-provider';

import { StackerDetailsRowsForUser } from './stacker-details-rows';

interface Props {
  nextRewardCycleId: number;
  preview: boolean;
}
export function Stacker({ nextRewardCycleId, preview }: Props) {
  const [field, meta] = useField('stacker');
  const { network } = useNetwork();
  return (
    <>
      {preview ? (
        <>
          <StackerDetailsRowsForUser
            address={field.value}
            network={network}
            nextRewardCycleId={nextRewardCycleId}
          />
          <Hr />

          <Text>Lock their delegated STX for 1 more cycle.</Text>
        </>
      ) : (
        <Text>
          Enter the Stacks address of a pool member to lock their delegated STX for 1 more cycle.
        </Text>
      )}

      <Box position="relative" maxWidth="400px">
        <Input
          id="stacker"
          placeholder="Stacks address"
          mt="loose"
          isDisabled={preview}
          {...field}
        />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>
    </>
  );
}
