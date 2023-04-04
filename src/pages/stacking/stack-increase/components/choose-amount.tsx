import { Box, Button, Input, Stack, Text } from '@stacks/ui';
import BigNumber from 'bignumber.js';
import { useField } from 'formik';

import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { useGetAccountExtendedBalancesQuery } from '@components/stacking-client-provider/stacking-client-provider';
import { microStxToStx } from '@utils/unit-convert';

import { Description } from '../../components/stacking-form-step';
import { useGetHasPendingStackingTransactionQuery } from '../../direct-stacking-info/use-get-has-pending-tx-query';
import { getAvailableAmountUstx } from '../utils';

export function Amount() {
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const { getHasPendingStackIncreaseQuery } = useGetHasPendingStackingTransactionQuery();

  const [field, meta, helpers] = useField('increaseBy');
  const maxAmountUstx = getAccountExtendedBalancesQuery.data?.stx
    ? getAvailableAmountUstx(
        getAccountExtendedBalancesQuery.data.stx,
        getHasPendingStackIncreaseQuery.data
      )
    : undefined;
  const setMax = () => {
    if (maxAmountUstx) {
      helpers.setValue(microStxToStx(maxAmountUstx).toFixed(0, BigNumber.ROUND_DOWN));
    }
  };

  return (
    <Stack>
      <Description>
        <Stack alignItems="flex-start" spacing="base">
          <Text>
            Choose how much you want to add to the current value you are already stacking.
          </Text>
        </Stack>
      </Description>

      <Box position="relative" my="loose">
        <Input id="stxAmount" placeholder="Amount of additional STX to stack" {...field} />
        {meta.touched && meta.error && (
          <ErrorLabel>
            <ErrorText>{meta.error}</ErrorText>
          </ErrorLabel>
        )}
        <Button
          type="button"
          mode="tertiary"
          size="sm"
          height="28px"
          right="12px"
          top="10px"
          style={{ position: 'absolute' }}
          width="80px"
          onClick={setMax}
          isDisabled={!maxAmountUstx}
        >
          Stack max
        </Button>
      </Box>
    </Stack>
  );
}
