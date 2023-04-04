import { Box } from '@stacks/ui';
import { IconClockHour4 } from '@tabler/icons-react';

import { Alert, AlertText } from '@components/alert';

import { StackExtendInfo } from '../direct-stacking-info/get-has-pending-stack-extend';

interface Props {
  pendingStackExtend: StackExtendInfo;
}
export function PendingStackExtendAlert({ pendingStackExtend }: Props) {
  return (
    <Box pb="base-loose">
      <Alert icon={<IconClockHour4 />} title="Waiting for transaction confirmation">
        <AlertText>
          A stacking request was successfully submitted to the blockchain. Once confirmed, your STX
          will be stacking for an extra {pendingStackExtend.extendCycles.toString()} cycles.
        </AlertText>
      </Alert>
    </Box>
  );
}
