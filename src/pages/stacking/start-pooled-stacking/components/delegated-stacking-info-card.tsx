import { UI_IMPOSED_MAX_STACKING_AMOUNT_USTX } from '@constants/index';
import { stxToMicroStx, toHumanReadableStx } from '@utils/unit-convert';
import { truncateMiddle } from '@utils/tx-utils';
import { useFormikContext } from 'formik';
import { EditingFormValues } from '../types';
import { Card, Title, Text, Divider, Group, Stack, Box } from '@mantine/core';
import { formatCycles } from '@utils/stacking';
import { useGetPoxInfoQuery } from '@components/stacking-client-provider/stacking-client-provider';
import { cyclesToBurnChainHeight } from '@utils/calculate-burn-height';

function createAmountText(amountStx: string | number | bigint) {
  if (amountStx === '') return toHumanReadableStx(0);

  const amountMicroStx = stxToMicroStx(amountStx);
  if (amountMicroStx.isNaN() || amountMicroStx.gt(UI_IMPOSED_MAX_STACKING_AMOUNT_USTX)) return '—';

  return toHumanReadableStx(amountMicroStx);
}
export function PoolingInfoCard() {
  const f = useFormikContext<EditingFormValues>();
  const poxInfoQuery = useGetPoxInfoQuery();

  const amount = f.values.amount;
  const delegationType = f.values.delegationDurationType;
  const poolStxAddress = f.values.poolAddress;
  const durationInCycles =
    f.values.delegationDurationType === 'limited' ? f.values.numberOfCycles : null;

  const burnHeight =
    durationInCycles && poxInfoQuery.data
      ? cyclesToBurnChainHeight({
          cycles: durationInCycles,
          rewardCycleLength: poxInfoQuery.data.reward_cycle_length,
          currentCycleId: poxInfoQuery.data.current_cycle.id,
          firstBurnchainBlockHeight: poxInfoQuery.data.first_burnchain_block_height,
        })
      : null;
  const amountText = createAmountText(amount);

  return (
    <Card withBorder>
      <Stack>
        <Box>
          <Title order={4}>Start Pooling</Title>
          <Text fz="34px">{amountText}</Text>
        </Box>

        <Divider />

        <Stack>
          <Group position="apart">
            <Text>
              Duration
              {/* <Tooltip label="How long you want to delegate to the pool. This is not necessarily the locking duration. However, the locking period cannot be longer than the delegation duration."> */}
              {/*   <span> */}
              {/*     <IconQuestionCircle height="1rem" width="1rem" /> */}
              {/*   </span> */}
              {/* </Tooltip> */}
            </Text>
            <Text>
              {!delegationType && '—'}
              {delegationType === 'limited' && formatCycles(durationInCycles ?? 0)}
              {delegationType === 'indefinite' && 'Indefinite'}
            </Text>
          </Group>
          {burnHeight && (
            <Group position="apart">
              <Text>Burn height</Text>
              <Text> {burnHeight}</Text>
            </Group>
          )}
        </Stack>

        <Divider />

        <Group position="apart">
          <Text>
            Pool address
            {/* <Tooltip label="This address is provided to you by your chosen pool for Stacking delegation specifically."> */}
            {/*   <span> */}
            {/*     <IconQuestionCircle height="1rem" width="1rem" /> */}
            {/*   </span> */}
            {/* </Tooltip> */}
          </Text>
          <Text>{poolStxAddress ? truncateMiddle(poolStxAddress) : '—'}</Text>
        </Group>

        <Divider />

        <Group position="apart">
          <Text>Contract</Text>
          <Text>{truncateMiddle(poxInfoQuery.data?.contract_id ?? '')}</Text>
        </Group>
      </Stack>
    </Card>
  );
}
