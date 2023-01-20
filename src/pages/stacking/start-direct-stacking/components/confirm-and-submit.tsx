import { Stack } from '@mantine/core';
import React, { FC, useState } from 'react';

import { Step, Action } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { DirectStackingTerms } from './direct-stacking-terms';

interface ConfirmAndLockStepProps {
  isLoading: boolean;
}

export const ConfirmAndStackStep: FC<ConfirmAndLockStepProps> = props => {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);

  return (
    <Step title="Confirm and stack" mb="300px">
      <Stack>
        <DirectStackingTerms mt="loose" />
        <StackingUserConfirm onChange={useConfirmed => setHasUserConfirmed(useConfirmed)} />
        <Action onClick={onConfirmAndLock} isDisabled={!hasUserConfirmed} type="submit">
          Confirm and start stacking
        </Action>
      </Stack>
    </Step>
  );
};
