import { Stack } from '@mantine/core';
import { useState } from 'react';

import { Step, Action } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { DelegatedStackingTerms } from './delegated-stacking-terms';

interface Props {
  isLoading: boolean;
}
export function ConfirmAndSubmit({ isLoading }: Props) {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);

  return (
    <Step title="Confirm and pool">
      <Stack>
        <DelegatedStackingTerms />
        <StackingUserConfirm onChange={useConfirmed => setHasUserConfirmed(useConfirmed)} />
        <Action type="submit" loading={isLoading} disabled={!hasUserConfirmed}>
          Confirm and start pooling
        </Action>
      </Stack>
    </Step>
  );
}
