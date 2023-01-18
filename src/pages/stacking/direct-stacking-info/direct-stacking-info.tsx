import {
  Alert,
  Anchor,
  Box,
  Card,
  Code,
  Divider,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import stackByYourselfImg from '@assets/images/stack-by-yourself.svg';
import { IconClockHour4, IconInfoCircle } from '@tabler/icons';
import {
  useGetAccountBalanceLocked,
  useGetAccountExtendedBalancesQuery,
  useGetCoreInfoQuery,
  useGetPoxInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { Link, useNavigate } from 'react-router-dom';
import { StackingClient } from '@stacks/stacking';
import { ErrorAlert } from '@components/error-alert';
import { toHumanReadableStx } from '@utils/unit-convert';
import { ExternalLink } from '@components/external-link';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { truncateMiddle } from '@utils/tx-utils';
import { Address } from '@components/address';

export function DirectStackingInfo() {
  const { client } = useStackingClient();
  if (!client) {
    const msg = 'Expected `client` to be defined.';
    console.error(msg);
    return <ErrorAlert id="6f080d24-1e87-45ab-b8f7-41ba9bd53e97">{msg}</ErrorAlert>;
  }

  return <DirectStackingInfoLayout client={client} />;
}

interface CardLayoutProps {
  client: StackingClient;
}
function DirectStackingInfoLayout({ client }: CardLayoutProps) {
  const navigate = useNavigate();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const getCoreInfoQuery = useGetCoreInfoQuery();
  const getAccountBalanceLockedQuery = useGetAccountBalanceLocked();
  const getPoxInfoQuery = useGetPoxInfoQuery();

  if (
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading ||
    getPoxInfoQuery.isLoading ||
    getAccountBalanceLockedQuery.isLoading
  ) {
    return <Loader />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getAccountBalanceLockedQuery.isError ||
    !getAccountBalanceLockedQuery.data ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data ||
    getPoxInfoQuery.isError ||
    !getPoxInfoQuery.data
  ) {
    const msg = 'Error while loading data, try reloading the page.';
    console.error(msg);
    return (
      <ErrorAlert id="0abc083b-06c7-4795-8491-68264595f1b4">
        <>
          <Text>{msg}</Text>
          <Code block>
            {JSON.stringify(
              {
                getStatusQuery,
                getAccountExtendedBalancesQuery,
                getAccountBalanceLockedQuery,
                getCoreInfoQuery,
                getPoxInfoQuery,
              },
              null,
              2
            )}
          </Code>
        </>
      </ErrorAlert>
    );
  }

  const isStacking = getStatusQuery.data.stacked;

  if (!isStacking) {
    return (
      <Card withBorder w="400px">
        <Alert icon={<IconInfoCircle />}>
          <Stack>
            <Text>
              It appears that you're not pooling yet. If you recently started to pool, your pooling
              info will appear here in a few seconds.
            </Text>
            <Text>
              You may want to{' '}
              <Anchor to="../start-pooled-stacking" component={Link}>
                start pooling
              </Anchor>{' '}
              or{' '}
              <Anchor to="../choose-stacking-method" component={Link}>
                choose your stacking method
              </Anchor>
              .
            </Text>
          </Stack>
        </Alert>
      </Card>
    );
  }

  let lockingProgressPercentString = '0';
  if (getStatusQuery.data.stacked) {
    const cycleLengthInBlocks =
      getAccountExtendedBalancesQuery.data.stx.burnchain_unlock_height -
      getAccountExtendedBalancesQuery.data.stx.burnchain_lock_height;

    const blocksUntilUnlocked =
      getAccountExtendedBalancesQuery.data.stx.burnchain_unlock_height -
      getCoreInfoQuery.data.burn_block_height;

    lockingProgressPercentString = Math.max(
      ((cycleLengthInBlocks - blocksUntilUnlocked) / cycleLengthInBlocks) * 100,
      0
    ).toFixed(2);
  }

  const elapsedCyclesSinceStackingStart = Math.max(
    getPoxInfoQuery.data.reward_cycle_id - getStatusQuery.data.details.first_reward_cycle,
    0
  );
  const elapsedStackingCycles = Math.min(
    elapsedCyclesSinceStackingStart,
    getStatusQuery.data.details.lock_period
  );

  const isBeforeFirstRewardCycle =
    getPoxInfoQuery.data.reward_cycle_id < getStatusQuery.data.details.first_reward_cycle;

  const poxAddress = formatPoxAddressToNetwork(getStatusQuery.data.details.pox_address);

  return (
    <>
      <Card withBorder w="400px">
        <Stack>
          <Image
            fit="contain"
            height="100px"
            width="130px"
            src={stackByYourselfImg}
            alt="Colourful illustration of a diving board protruding out of a blue hole"
          />

          <Stack>
            <Box>
              <Title order={4}>You're stacking</Title>
              <Text fz="34px">{toHumanReadableStx(getAccountBalanceLockedQuery.data)}</Text>
            </Box>

            {isBeforeFirstRewardCycle && (
              <Alert icon={<IconClockHour4 />} title="Waiting for the cycle to start">
                Your STX are ready for stacking. Once the next cycle starts the network will
                determine if and how many slots are claimed.
              </Alert>
            )}

            <Divider />

            <Stack>
              <Group position="apart">
                <Text>Duration</Text>
                <Text>
                  {elapsedStackingCycles} / {getStatusQuery.data.details.lock_period}
                </Text>
              </Group>
              <Group position="apart">
                <Text>Start</Text>
                <Text>Cycle {getStatusQuery.data.details.first_reward_cycle} ~ TODO:DATE</Text>
              </Group>
              <Group position="apart">
                <Text>End</Text>
                <Text>
                  Cycle{' '}
                  {getStatusQuery.data.details.first_reward_cycle +
                    getStatusQuery.data.details.lock_period}{' '}
                  ~ TODO:DATE
                </Text>
              </Group>

              <Divider />

              <Group position="apart">
                <Text>Reward slots</Text>
                <Text>TODO</Text>
              </Group>
              {poxAddress && (
                <Group position="apart">
                  <Text>Bitcoin address</Text>
                  <Address address={poxAddress} />
                </Group>
              )}

              <Divider />

              <ExternalLink
                href={`https://stacking.club/reward-address/${String(
                  formatPoxAddressToNetwork(getStatusQuery.data.details.pox_address)
                )}`}
              >
                🥞 View on stacking.club
              </ExternalLink>
            </Stack>
          </Stack>

          <Alert icon={<IconInfoCircle />}>TODO</Alert>
        </Stack>
      </Card>
    </>
  );
}
