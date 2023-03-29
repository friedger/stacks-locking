import { Box, Button, Input, Spinner, Stack, Text, color } from '@stacks/ui';
import { BigNumber } from 'bignumber.js';
import { useField } from 'formik';

import { ErrorAlert } from '@components/error-alert';
import { ErrorLabel } from '@components/error-label';
import { ErrorText } from '@components/error-text';
import { OpenExternalLinkInNewTab } from '@components/external-link';
import {
  useGetAccountExtendedBalancesQuery,
  useGetPoxInfoQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { pseudoBorderLeft } from '@components/styles/pseudo-border-left';
import {
  STACKING_CONTRACT_CALL_TX_BYTES,
  STACKING_LEARN_MORE_URL,
  STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL,
} from '@constants/app';
import { microStxToStx, stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';

import { Description, Step } from '../../components/stacking-form-step';
import { calculateRewardSlots, calculateStackingBuffer } from '../../utils/calc-stacking-buffer';

const BigNumberFloorRound = BigNumber.clone({
  ROUNDING_MODE: BigNumber.ROUND_FLOOR,
});

export function Amount() {
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  const [field, meta, helpers] = useField('amount');

  if (getAccountExtendedBalancesQuery.isLoading || getPoxInfoQuery.isLoading) return <Spinner />;

  if (
    getAccountExtendedBalancesQuery.isError ||
    typeof getAccountExtendedBalancesQuery.data.stx.balance !== 'string' ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data
  ) {
    const id = '134098d7-444b-4591-abfe-8767af6def3f';
    const msg = 'Failed to load necessary data.';
    console.error(id, msg);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }

  const availableBalance = getAccountExtendedBalancesQuery.data.stx.balance;
  const minimumAmountUstx = getPoxInfoQuery.data.min_amount_ustx;

  const ustxAmount = stxToMicroStx(field.value || 0);

  const showStackingWarningCard = ustxAmount.isGreaterThanOrEqualTo(minimumAmountUstx);

  let maxAmountUstx = new BigNumberFloorRound(
    new BigNumber(availableBalance.toString()).minus(STACKING_CONTRACT_CALL_TX_BYTES).toString()
  ).decimalPlaces(0);
  if (maxAmountUstx.isNegative()) {
    maxAmountUstx = new BigNumber(0);
  }

  const setMax = () => {
    helpers.setValue(microStxToStx(maxAmountUstx.toString()).toFixed(0, BigNumber.ROUND_DOWN));
  };

  const numberOfRewardSlots = calculateRewardSlots(
    ustxAmount,
    new BigNumber(minimumAmountUstx)
  ).integerValue();

  const buffer = calculateStackingBuffer(ustxAmount, new BigNumber(minimumAmountUstx));

  return (
    <Step title="Choose amount">
      <Description>
        <Stack alignItems="flex-start" spacing="base">
          <Text>
            You&apos;ll be eligible for one reward slot for every multiple of the minimum you stack.
          </Text>
          <Text>
            The estimated minimum per slot can change by multiples of 10,000 every cycle, so you may
            want to add a buffer to increase your chance of keeping the same number of slots.
          </Text>
          <OpenExternalLinkInNewTab href={STACKING_LEARN_MORE_URL}>
            Learn more about risks of stacking at or near the minimum
          </OpenExternalLinkInNewTab>
          <OpenExternalLinkInNewTab href={STACKING_MINIMIUM_FOR_NEXT_CYCLE_URL}>
            View the minimum for next cycle
          </OpenExternalLinkInNewTab>
        </Stack>
      </Description>

      <Box position="relative" maxWidth="400px">
        <Input id="stxAmount" placeholder="Amount of STX to Stack" mt="loose" {...field} />
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
        >
          Stack max
        </Button>
      </Box>

      {showStackingWarningCard && (
        <>
          <Stack textStyle="body.small" color={color('text-caption')} spacing="base" mt="base">
            <Text>
              This entered amount would get you {numberOfRewardSlots.toString()} reward slot
              {numberOfRewardSlots.toNumber() === 1 ? '' : 's'} with a{' '}
              {toHumanReadableStx(buffer || 0)} buffer at the current minimum. However, that minimum
              is subject to change and there is no guarantee you will get any reward slots.
            </Text>
          </Stack>

          {buffer !== null && buffer.isEqualTo(0) && (
            <Box
              textStyle="body.small"
              color={color('text-body')}
              border="1px solid"
              p="loose"
              mt="base"
              borderRadius="6px"
              borderColor={color('border')}
              {...pseudoBorderLeft('feedback-alert')}
            >
              Add a buffer for a higher chance (though no guarantee) of keeping the same number of
              reward slots should the minimum increase. If you can’t add a buffer, consider Stacking
              in a pool instead.
              <Button
                variant="link"
                type="button"
                display="block"
                mt="tight"
                onClick={() => helpers.setValue(new BigNumber(field.value).plus(10000).toString())}
              >
                Add 10,000 STX buffer
              </Button>
            </Box>
          )}
        </>
      )}
    </Step>
  );
}
