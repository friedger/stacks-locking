import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDelegationStatusQuery } from './use-delegation-status-query';
import { useGetPoolAddress } from './use-get-pool-address-query';
import { Address } from '@components/address';
import { Alert } from '@components/alert';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import {
  useGetAccountExtendedBalancesQuery,
  useGetCoreInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { Caption } from '@components/typography';
import { intToBigInt } from '@stacks/common';
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StackingClient } from '@stacks/stacking';
import { Box, Button, Flex, Stack, Text } from '@stacks/ui';
import { IconInfoCircle } from '@tabler/icons-react';
import { toHumanReadableStx } from '@utils/unit-convert';
import { StartStackingLayout } from 'src/pages/choose-stacking-method/components/start-stacking-layout';
import { CenteredErrorAlert } from '@components/centered-error-alert';
import { CenteredSpinner } from '@components/centered-spinner';

export function PooledStackingInfo() {
  const { client } = useStackingClient();
  if (!client) {
    const msg = 'Expected `client` to be defined.';
    console.error(msg);
    return <CenteredErrorAlert id="6f080d24-1e87-45ab-b8f7-41ba9bd53e97">{msg}</CenteredErrorAlert>;
  }

  return <PooledStackingInfoLayout client={client} />;
}

interface CardLayoutProps {
  client: StackingClient;
}
function PooledStackingInfoLayout({ client }: CardLayoutProps) {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const navigate = useNavigate();
  const delegationStatusQuery = useDelegationStatusQuery();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesQuery();
  const getCoreInfoQuery = useGetCoreInfoQuery();
  const getPoolAddressQuery = useGetPoolAddress();

  if (
    delegationStatusQuery.isLoading ||
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading ||
    getPoolAddressQuery.isLoading ||
    getPoolAddressQuery.isFetching
  ) {
    return <CenteredSpinner />;
  }

  if (
    delegationStatusQuery.isError ||
    !delegationStatusQuery.data ||
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getPoolAddressQuery.isError ||
    !getPoolAddressQuery.data ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data
  ) {
    const msg = 'Error while loading data, try reloading the page.';
    console.error(msg);
    return (
      <CenteredErrorAlert id="0abc083b-06c7-4795-8491-68264595f1b4">
        <Text>{msg}</Text>
      </CenteredErrorAlert>
    );
  }

  const isStacking = getStatusQuery.data.stacked;
  const poolAddress = getPoolAddressQuery.data.address || delegationStatusQuery.data.delegatedTo;
  console.log(delegationStatusQuery.data, getStatusQuery.data, poolAddress);
  if ((!delegationStatusQuery.data.isDelegating && !isStacking) || !poolAddress) {
    return (
      <StartStackingLayout>
        <InfoCard p="extra-loose" width={['360px', '360px', '360px', '420px']}>
          <Alert icon={<IconInfoCircle />}>
            <Stack>
              <Text>
                It appears that you&apos;re not pooling yet. If you recently started to pool, your
                pooling info will appear here in a few seconds.
              </Text>
              <Text>
                You may want to{' '}
                <Caption display="inline" to="../start-pooled-stacking" as={Link}>
                  start pooling
                </Caption>{' '}
                or{' '}
                <Caption display="inline" to="../choose-stacking-method" as={Link}>
                  choose your stacking method
                </Caption>
                .
              </Text>
            </Stack>
          </Alert>
        </InfoCard>
      </StartStackingLayout>
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

  async function handleStopPoolingClick() {
    const stackingContract = await client.getStackingContract();
    const revokeDelegationOptions = client.getRevokeDelegateStxOptions(stackingContract);
    setIsContractCallExtensionPageOpen(true);
    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by `openContractCall`. Despite
      // the wider type, the actual value of `network` is always of the type `StacksNetwork`
      // expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(revokeDelegationOptions as ContractCallRegularOptions),
      onCancel() {
        setIsContractCallExtensionPageOpen(false);
      },
      onFinish() {
        setIsContractCallExtensionPageOpen(false);
      },
    });
  }
  return (
    <>
      <Flex justify="center" align="center">
        <InfoCard width="420px">
          <Box mx={['loose', 'extra-loose']}>
            <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
              {delegationStatusQuery.data.isDelegating && !delegationStatusQuery.data.isExpired && (
                <>
                  <Text textStyle="body.large.medium">You&apos;re pooling</Text>
                  <Text
                    fontSize="24px"
                    fontFamily="Open Sauce"
                    fontWeight={500}
                    letterSpacing="-0.02em"
                    mt="extra-tight"
                  >
                    {toHumanReadableStx(delegationStatusQuery.data.amountMicroStx)}
                  </Text>

                  <Hr />

                  <Group mt="base-loose" mb="extra-loose">
                    <Section>
                      <Row>
                        <Label>Status</Label>
                        <Value color={isStacking ? 'green' : undefined}>
                          {isStacking ? 'Active' : 'Waiting on pool'}
                        </Value>
                      </Row>
                      <Row>
                        <Label>Type</Label>
                        <Value>
                          {delegationStatusQuery.data.untilBurnHeight ? 'One time' : 'Indefinite'}
                        </Value>
                      </Row>
                      <Row>
                        <Label>Progress</Label>
                        <Value>{lockingProgressPercentString}%</Value>
                      </Row>
                    </Section>
                  </Group>

                  <Hr />

                  <Group mt="base-loose" mb="extra-loose">
                    <Section>
                      <Row>
                        <Label>Pool address</Label>
                        <Value>
                          <Address address={poolAddress} />
                        </Value>
                      </Row>
                    </Section>
                  </Group>

                  <Hr />

                  <Button
                    isDisabled={isContractCallExtensionPageOpen}
                    onClick={() => {
                      handleStopPoolingClick();
                    }}
                  >
                    Stop pooling
                  </Button>
                </>
              )}

              {delegationStatusQuery.data.isDelegating && delegationStatusQuery.data.isExpired && (
                <>
                  <Text textStyle="display.large">You&apos;ve finished pooling</Text>
                  <Text pb="base-loose">
                    Revoke the pool&apos;s permission to stack on your behalf to start stacking
                    again.
                  </Text>
                  <Box>
                    <Button
                      disabled={isContractCallExtensionPageOpen}
                      onClick={() => {
                        handleStopPoolingClick();
                      }}
                    >
                      Revoke permission
                    </Button>
                  </Box>
                </>
              )}

              {!delegationStatusQuery.data.isDelegating && (
                <>
                  <Text testStyle="display.large">You&apos;re pooling</Text>
                  <Text
                    fontSize="24px"
                    fontFamily="Open Sauce"
                    fontWeight={500}
                    letterSpacing="-0.02em"
                    mt="extra-tight"
                  >
                    {toHumanReadableStx(
                      intToBigInt(getAccountExtendedBalancesQuery.data.stx.locked, false)
                    )}
                  </Text>

                  <Hr />

                  <Group mt="base-loose" mb="base-loose">
                    <Section>
                      <Row>
                        <Label>Status</Label>
                        <Value color={isStacking ? 'green' : undefined}>
                          {isStacking ? 'Active' : 'Waiting on pool'}
                        </Value>
                      </Row>
                      <Row>
                        <Label>Progress</Label>
                        <Value>{lockingProgressPercentString}%</Value>
                      </Row>
                    </Section>

                    {poolAddress && (
                      <Section>
                        <Row>
                          <Label>Pool address</Label>
                          <Value>
                            <Address address={poolAddress} />
                          </Value>
                        </Row>
                      </Section>
                    )}

                    <Section>
                      <Alert icon={<IconInfoCircle />}>
                        You&apos;ve revoked the pool&apos;s delegation. You may want to{' '}
                        <Caption display="inline" to="../start-pooled-stacking" as={Link}>
                          start pooling
                        </Caption>{' '}
                        again or{' '}
                        <Caption display="inline" to="../choose-stacking-method" as={Link}>
                          choose a different stacking method
                        </Caption>
                        .
                      </Alert>
                    </Section>
                  </Group>
                </>
              )}
            </Flex>
          </Box>
        </InfoCard>
      </Flex>
    </>
  );
}
