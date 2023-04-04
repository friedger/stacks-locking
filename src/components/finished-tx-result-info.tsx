import { FinishedTxData } from '@stacks/connect';
import { Box, Stack, Text } from '@stacks/ui';

import { Alert, AlertText } from './alert';

interface FinishedTxResultInfoProps {
  txResult: FinishedTxData;
}

export function FinishedTxResultInfo({ txResult }: FinishedTxResultInfoProps) {
  return (
    <Box my="loose">
      <Alert title="Last tx result">
        <AlertText>{txResult.txId}</AlertText>
      </Alert>
    </Box>
  );
}
