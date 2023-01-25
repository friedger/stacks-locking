import { useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';

import { microStxToStx, stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';

import {
  STACKING_CONTRACT_CALL_TX_BYTES,
  STACKING_LEARN_MORE_URL,
  STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL,
} from '@constants/index';

import { Step, Description } from '../../components/stacking-form-step';
import { calculateRewardSlots, calculateStackingBuffer } from '../../utils/calc-stacking-buffer';
import {
  useGetAccountBalance,
  useGetPoxInfoQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { Alert, Anchor, Loader, Stack, Text } from '@mantine/core';
import { ErrorAlert } from '@components/error-alert';
import { ExternalLink } from '@components/external-link';
import { AmountField } from '../../components/fields/amount-field';
import { IconInfoCircle } from '@tabler/icons-react';

const BigNumberFloorRound = BigNumber.clone({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });

export function Amount() {
  const getAccountBalanceQuery = useGetAccountBalance();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  const [field, _meta, helpers] = useField('amount');

  if (getAccountBalanceQuery.isLoading || getPoxInfoQuery.isLoading) return <Loader />;

  if (
    getAccountBalanceQuery.isError ||
    typeof getAccountBalanceQuery.data !== 'bigint' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data
  ) {
    const id = '134098d7-444b-4591-abfe-8767af6def3f';
    const msg = 'Failed to load necessary data.';
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  const availableBalance = getAccountBalanceQuery.data;
  const minimumAmountUstx = getPoxInfoQuery.data.min_amount_ustx;

  const ustxAmount = stxToMicroStx(field.value || 0);

  const showStackingWarningCard = ustxAmount.isGreaterThanOrEqualTo(minimumAmountUstx);

  let maxAmountUstx = new BigNumberFloorRound(
    new BigNumber(availableBalance.toString()).minus(STACKING_CONTRACT_CALL_TX_BYTES).toString()
  ).decimalPlaces(0);
  if (maxAmountUstx.isNegative()) {
    maxAmountUstx = new BigNumber(0);
  }

  const setMax = useCallback(() => {
    helpers.setValue(microStxToStx(maxAmountUstx.toString()));
  }, [maxAmountUstx, helpers]);

  const numberOfRewardSlots = calculateRewardSlots(
    ustxAmount,
    new BigNumber(minimumAmountUstx)
  ).integerValue();

  const buffer = calculateStackingBuffer(ustxAmount, new BigNumber(minimumAmountUstx));

  return (
    <Step title="Amount">
      <Stack>
        <Description>
          <Stack>
            <Text>
              You'll be eligible for one reward slot for every multiple of the minimum you stack.
            </Text>
            <Text>
              The estimated minimum per slot can change by multiples of 10,000 every cycle, so you
              may want to add a buffer to increase your chance of keeping the same number of slots.
            </Text>
            <ExternalLink href={STACKING_LEARN_MORE_URL}>
              Learn how to choose the right amount
            </ExternalLink>
            <ExternalLink href={STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL}>
              View the minimum for next cycle
            </ExternalLink>
          </Stack>
        </Description>

        <Stack>
          <AmountField placeholder="Amount of STX to Stack" />
          <Text>
            Stack max:{' '}
            <Anchor component="button" type="button" onClick={setMax}>
              {toHumanReadableStx(maxAmountUstx)}
            </Anchor>
          </Text>
          {showStackingWarningCard && (
            <>
              <Stack>
                <Text>
                  This entered amount would get you {numberOfRewardSlots.toString()} reward slot
                  {numberOfRewardSlots.toNumber() === 1 ? '' : 's'} with a{' '}
                  {toHumanReadableStx(buffer || 0)} buffer at the current minimum. However, that
                  minimum is subject to change and there is no guarantee you will get any reward
                  slots.
                </Text>
              </Stack>
              {buffer !== null && buffer.isEqualTo(0) && (
                <Alert icon={<IconInfoCircle />} color="orange">
                  <Text>
                    Add a buffer for a higher chance (though no guarantee) of keeping the same
                    number of reward slots should the minimum increase. If you can’t add a buffer,
                    consider Stacking in a pool instead.
                  </Text>
                  <Anchor
                    component="button"
                    type="button"
                    onClick={() =>
                      helpers.setValue(new BigNumber(field.value).plus(10000).toString())
                    }
                  >
                    Add 10,000 STX buffer
                  </Anchor>
                </Alert>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Step>
  );
}
