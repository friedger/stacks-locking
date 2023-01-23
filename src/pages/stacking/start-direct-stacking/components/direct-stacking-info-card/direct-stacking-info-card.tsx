import React, { FC, useMemo } from 'react';
import { Box, Card, Divider, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { BigNumber } from 'bignumber.js';
import dayjs from 'dayjs';

import { Hr } from '@components/hr';

import { UI_IMPOSED_MAX_STACKING_AMOUNT_USTX } from '@constants/index';
import { truncateMiddle } from '@utils/tx-utils';
import { parseNumericalFormInput } from '@utils/form/parse-numerical-form-input';
import { stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { calculateRewardSlots, calculateStackingBuffer } from '../../../utils/calc-stacking-buffer';
import { useFormikContext } from 'formik';
import { DirectStackingFormValues } from '../../types';
import {
  useGetPoxInfoQuery,
  useGetSecondsUntilNextCycleQuery,
} from '@components/stacking-client-provider/stacking-client-provider';
import { createAmountText } from '../../../utils/create-amount-text';
import { addSeconds, format, formatDistanceToNow } from 'date-fns';
import { Start } from './components/start';

export function InfoPanel() {
  const f = useFormikContext<DirectStackingFormValues>();
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const getSecondsUntilNextCycleQuery = useGetSecondsUntilNextCycleQuery();

  const { amount, lockPeriod, poxAddress } = f.values;

  const amountText = createAmountText(amount);

  const amountToBeStacked = useMemo(
    () => stxToMicroStx(parseNumericalFormInput(amount)).integerValue(),
    [amount]
  );

  const humanReadableAmount = useMemo(() => {
    // There is no enforced upper limit for direct stacking
    // but for rididuclous numbers we don't display in UI to prevent layouts breaking
    if (amountToBeStacked.isGreaterThan(UI_IMPOSED_MAX_STACKING_AMOUNT_USTX.multipliedBy(100))) {
      return '—';
    }
    return toHumanReadableStx(amountToBeStacked);
  }, [amountToBeStacked]);

  const numberOfRewardSlots = calculateRewardSlots(
    amountToBeStacked,
    new BigNumber(getPoxInfoQuery.data?.min_amount_ustx || 0)
  ).integerValue();

  const buffer = calculateStackingBuffer(
    amountToBeStacked,
    new BigNumber(getPoxInfoQuery.data?.min_amount_ustx || 0)
  );

  return (
    <Card withBorder>
      <Stack>
        <Box>
          <Title order={4}>You'll lock</Title>
          <Text fz={34}>{createAmountText(amount)}</Text>
        </Box>

        <Divider />

        <Group position="apart">
          <Text>Reward slots</Text>
          <Text>{numberOfRewardSlots.toString()}</Text>
        </Group>
        <Group position="apart">
          <Text>Buffer</Text>
          <Text>{buffer === null ? 'No buffer' : toHumanReadableStx(buffer)}</Text>
        </Group>

        <Divider />

        <Group position="apart">
          <Text>Cycles</Text>
          <Text>{lockPeriod}</Text>
        </Group>
        <Start />
        {/* <Group position="apart"> */}
        {/*   <Text>End</Text> */}
        {/*   <Text>TODO</Text> */}
        {/* </Group> */}

        <Divider />

        <Group position="apart">
          <Text>Bitcoin address</Text>
          <Text>{poxAddress ? truncateMiddle(poxAddress) : '—'}</Text>
        </Group>
      </Stack>
    </Card>
  );
}
