import { Box, Input, Stack, Text } from '@stacks/ui';
import { useField } from 'formik';

import { ErrorAlert } from '@components/error-alert';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useGetPoxInfoQuery } from '@components/stacking-client-provider/stacking-client-provider';

import { Description, Step } from '../../components/stacking-form-step';
import { Balances } from './balances';

export function Amount() {
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const [field, meta] = useField('amount');

  if (getPoxInfoQuery.isError || !getPoxInfoQuery.data) {
    const id = '134098d7-444b-4591-abfe-8767af6def3f';
    const msg = 'Failed to load necessary data.';
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  return (
    <Step title="Choose amount">
      <Description>
        <Stack alignItems="flex-start" spacing="base">
          <Text>
            Must be less than or equal to the delegated amount and the stacker&apos;s balance.
          </Text>
        </Stack>
      </Description>

      <Box position="relative" maxWidth="400px">
        <Input id="stxAmount" placeholder="Amount of STX to Stack" mt="loose" {...field} />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>
      <Balances />
    </Step>
  );
}
