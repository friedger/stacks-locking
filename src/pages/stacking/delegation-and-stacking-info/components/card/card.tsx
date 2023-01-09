import { Flex, Box, Text, color, Button } from '@stacks/ui';

import { truncateMiddle } from '@utils/tx-utils';
import { toHumanReadableStx } from '@utils/unit-convert';
import pooledStackingImg from '@assets/images/pooled-stacking-swimming-pool.svg';
import {
  InfoCard,
  InfoCardGroup,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { Hr } from '@components/hr';
import { IconBan } from '@tabler/icons';
import { Title } from '@components/title';
import {
  useGetAccountExtendedBalances,
  useGetCoreInfoQuery,
  useGetStatusQuery,
  useStackingClient,
} from '@components/stacking-client-provider/stacking-client-provider';
import { useDelegationStatusQuery } from '../../useDelegationStatusQuery';
import { useState } from 'react';
import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { useNavigate } from 'react-router-dom';
import { StackingClient } from '@stacks/stacking';
import { RevokeDelegationModal } from './components/modal';

export function Card() {
  const { client } = useStackingClient();
  if (!client) {
    // TODO log error
    console.error('Expected `client` to be defined.');
    return null;
  }

  return <CardLayout client={client} />;
}

interface CardLayoutProps {
  client: StackingClient;
}
function CardLayout({ client }: CardLayoutProps) {
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const delegationStatusQuery = useDelegationStatusQuery();
  const getStatusQuery = useGetStatusQuery();
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalances();
  const getCoreInfoQuery = useGetCoreInfoQuery();

  if (
    delegationStatusQuery.isLoading ||
    getStatusQuery.isLoading ||
    getAccountExtendedBalancesQuery.isLoading ||
    getCoreInfoQuery.isLoading
  ) {
    // TODO
    return <Text>Loading...</Text>;
  }

  if (
    delegationStatusQuery.isError ||
    !delegationStatusQuery.data ||
    getStatusQuery.isError ||
    !getStatusQuery.data ||
    getAccountExtendedBalancesQuery.isError ||
    !getAccountExtendedBalancesQuery.data ||
    getCoreInfoQuery.isError ||
    !getCoreInfoQuery.data
  ) {
    // TODO: report error
    return <Text>Error</Text>;
  }

  let lockingProgressPercentString = '0';
  if (getStatusQuery.data.stacked) {
    const cycleLengthInBlocks =
      getAccountExtendedBalancesQuery.data.stx.burnchain_unlock_height -
      getAccountExtendedBalancesQuery.data.stx.burnchain_lock_height;

    const blocksUntilUnlocked =
      getAccountExtendedBalancesQuery.data.stx.burnchain_unlock_height -
      getCoreInfoQuery.data.burn_block_height;

    lockingProgressPercentString = (
      ((cycleLengthInBlocks - blocksUntilUnlocked) / cycleLengthInBlocks) *
      100
    ).toFixed(2);
  }
  const isStacking = getStatusQuery.data.stacked;

  async function handleStopPoolingClick() {
    const stackingContract = await client.getStackingContract();
    const revokeDelegationOptions = client.getRevokeDelegateStxOptions(stackingContract);
    setIsContractCallExtensionPageOpen(true);
    openContractCall({
      // Type coercion necessary because the `network` property returned by
      // `client.getStackingContract()` has a wider type than allowed by
      // `openContractCall`. Despite the wider type, the actual value of `network` is
      // always of the type `StacksNetwork` expected by `openContractCall`.
      //
      // See
      // https://github.com/hirosystems/stacks.js/blob/0e1f9f19dfa45788236c9e481f9a476d9948d86d/packages/stacking/src/index.ts#L1054
      ...(revokeDelegationOptions as ContractCallRegularOptions),
      onCancel() {
        setIsOpen(false);
        setIsContractCallExtensionPageOpen(false);
      },
      onFinish() {
        setIsOpen(false);
        setIsContractCallExtensionPageOpen(false);
        navigate('../choose-stacking-method');
      },
    });
  }
  return (
    <>
      <InfoCard minHeight="180px" mt="extra-loose" px={['loose', 'extra-loose']} minWidth="350px">
        <Flex mt="loose">
          <img
            src={pooledStackingImg}
            alt="Colourful illustration of a diving board protruding out of a blue hole"
          />
        </Flex>

        {!delegationStatusQuery.data.isExpired && (
          <>
            <Flex flexDirection="column" mt="base-loose" pb="base-loose">
              <Text textStyle="body.large.medium">You're pooling</Text>
              <Text
                fontSize="24px"
                mt="extra-tight"
                fontWeight={500}
                fontFamily="Open Sauce"
                letterSpacing="-0.02em"
              >
                {toHumanReadableStx(delegationStatusQuery.data.amountMicroStx)}
              </Text>
            </Flex>
            <Hr />
            <InfoCardGroup my="loose">
              <Section>
                <Row>
                  <Label>Status</Label>
                  <Value color={color(isStacking ? 'feedback-success' : 'text-caption')}>
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

              <Section>
                <Row>
                  <Label>Pool address</Label>
                  <Value>{truncateMiddle(delegationStatusQuery.data.delegatedTo, 6)}</Value>
                </Row>
              </Section>

              <Section>
                <Row>
                  <Label>
                    <Button
                      isDisabled={isContractCallExtensionPageOpen}
                      variant="link"
                      border={0}
                      color={color('text-caption')}
                      textStyle="body.small"
                      fontSize="16px"
                      onClick={() => {
                        setIsOpen(true);
                      }}
                    >
                      <Box mr="extra-tight">
                        <IconBan size="14px" />
                      </Box>
                      Stop pooling
                    </Button>
                  </Label>
                </Row>
              </Section>
            </InfoCardGroup>
          </>
        )}

        {delegationStatusQuery.data.isExpired && (
          <Box mt="base" mb="loose">
            <Title fontSize="24px">You've finished pooling</Title>
            <Text>
              Revoke the pool's permission to stack on your behalf to start stacking again.
            </Text>
            <Box>
              <Button
                isDisabled={isContractCallExtensionPageOpen}
                onClick={() => {
                  setIsOpen(true);
                }}
                mt="loose"
              >
                Revoke permission
              </Button>
            </Box>
          </Box>
        )}
      </InfoCard>
      <RevokeDelegationModal
        isStacking={isStacking}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onStopPoolingClick={handleStopPoolingClick}
      />
    </>
  );
}
