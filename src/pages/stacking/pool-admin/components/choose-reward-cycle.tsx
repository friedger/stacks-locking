import { Box, Input, Stack, Text } from '@stacks/ui';
import { useField } from 'formik';

import { ErrorAlert } from '@components/error-alert';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useGetPoxInfoQuery } from '@components/stacking-client-provider/stacking-client-provider';

import { Description, Step } from '../../components/stacking-form-step';

export function RewardCycle() {
  const getPoxInfoQuery = useGetPoxInfoQuery();

  const [field, meta] = useField('rewardCycleId');

  if (getPoxInfoQuery.isError || !getPoxInfoQuery.data) {
    const id = '134098d7-444b-4591-abfe-8767af6def3f';
    const msg = 'Failed to load necessary data.';
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  return (
    <Step title="Choose reward cycle">
      <Description>
        <Stack alignItems="flex-start" spacing="base">
          <Text>Next cycle is {getPoxInfoQuery.data.reward_cycle_id + 1}</Text>
        </Stack>
      </Description>

      <Box position="relative" maxWidth="400px">
        <Input id="rewardCycle" placeholder="Next cycle" mt="loose" {...field} />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>
    </Step>
  );
}
