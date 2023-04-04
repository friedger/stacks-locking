import { Box } from '@stacks/ui';
import { IconClockHour4 } from '@tabler/icons-react';

import { Alert, AlertText } from '@components/alert';
import { toHumanReadableStx } from '@utils/unit-convert';

import { StackIncreaseInfo } from '../direct-stacking-info/get-has-pending-stack-increase';

interface Props {
  pendingStackIncrease: StackIncreaseInfo;
}
export function PendingStackIncreaseAlert({ pendingStackIncrease }: Props) {
  return (
    <Box pb="base-loose">
      <Alert icon={<IconClockHour4 />} title="Waiting for transaction confirmation">
        <AlertText>
          A stacking request was successfully submitted to the blockchain. Once confirmed, an
          additional amount of {toHumanReadableStx(pendingStackIncrease.increaseBy)} will be
          stacking.
        </AlertText>
      </Alert>
    </Box>
  );
}
