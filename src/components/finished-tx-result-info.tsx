import { FinishedTxData } from '@stacks/connect';
import { Box, Stack, Text } from '@stacks/ui';

import { Alert } from './alert';

interface FinishedTxResultInfoProps {
  txResult: FinishedTxData;
}

export function FinishedTxResultInfo({ txResult }: FinishedTxResultInfoProps) {
  return (
    <Box my="loose">
      <Alert title="Last tx result">
        <Stack>
          <Text>{txResult.txId}</Text>
        </Stack>
      </Alert>
    </Box>
  );
}
