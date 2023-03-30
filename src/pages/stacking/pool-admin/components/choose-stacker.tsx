import { Box, Input, Stack } from '@stacks/ui';
import { useField } from 'formik';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';

import { Description, Step } from '../../components/stacking-form-step';

export function Stacker() {
  const [field, meta] = useField('stacker');

  return (
    <Step title="Stacker">
      <Description>
        <Stack alignItems="flex-start" spacing="base">
          The stacks address of your pool member.
        </Stack>
      </Description>

      <Box position="relative" maxWidth="400px">
        <Input id="stacker" placeholder="Stacks address" mt="loose" {...field} />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
      </Box>
    </Step>
  );
}
