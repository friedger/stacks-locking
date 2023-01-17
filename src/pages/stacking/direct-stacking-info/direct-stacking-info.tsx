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
import { IconInfoCircle } from '@tabler/icons';
import {
  useGetAccountExtendedBalancesQuery,
  useGetCoreInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useState } from 'react';
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { Link, useNavigate } from 'react-router-dom';
import { StackingClient } from '@stacks/stacking';
import { ErrorAlert } from '@components/error-alert';

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

  if (
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading
  ) {
    return <Loader />;
  }

  if (
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data
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
                getCoreInfoQuery,
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
              <Title order={4}>WIP: Direct Stacking</Title>
              <Text fz="34px">
                {/* {toHumanReadableStx(delegationStatusQuery.data.amountMicroStx)} */}
                TODO
              </Text>
            </Box>

            <Divider />

            <Stack>
              <Group position="apart">
                <Text>Status</Text>
                {/* <Text c={isStacking ? 'green' : undefined}> */}
                {/*   {isStacking ? 'Active' : 'Waiting on pool'} */}
                {/* </Text> */}
                <Text>TODO</Text>
              </Group>
              <Group position="apart">
                <Text>Progress</Text>
                <Text>{lockingProgressPercentString}%</Text>
              </Group>
            </Stack>
          </Stack>

          <Alert icon={<IconInfoCircle />}>TODO</Alert>
        </Stack>
      </Card>
    </>
  );
}
