import { Box, color } from '@stacks/ui';
import { useFormikContext } from 'formik';
import { PooledStackerFormValues } from 'src/types/stacking';

import { toHumanReadableStx } from '@utils/unit-convert';

export function Balances() {
  const { values } = useFormikContext<PooledStackerFormValues>();

  const { delegated, lockedAmount, totalAmount, delegatedAmount } = values;

  if (delegated === undefined || !lockedAmount || !totalAmount || !delegatedAmount) {
    return null;
  }

  return (
    <>
      <Box textStyle="body.small" color={color('text-caption')} mt="base-tight">
        Available balance: {toHumanReadableStx(totalAmount)}
      </Box>
      <Box textStyle="body.small" color={color('text-caption')} mt="base-tight">
        Locked amount: {toHumanReadableStx(lockedAmount)}
      </Box>
      <Box textStyle="body.small" color={color('text-caption')} mt="base-tight">
        Delegated amount: {toHumanReadableStx(delegatedAmount)}
      </Box>
    </>
  );
}
