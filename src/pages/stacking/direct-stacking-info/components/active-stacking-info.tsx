import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ContractCallRegularOptions, openContractCall } from '@stacks/connect';
import { StackerInfo } from '@stacks/stacking';
import { Box, Button, Flex, Text } from '@stacks/ui';
import { IconClockHour4 } from '@tabler/icons-react';

import { Address } from '@components/address';
import { Alert } from '@components/alert';
import { OpenExternalLinkInNewTab } from '@components/external-link';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { useStackingClient } from '@components/stacking-client-provider/stacking-client-provider';
import { makeStackingClubRewardAddressLink } from '@utils/external-links';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { toHumanReadableStx } from '@utils/unit-convert';

type ActiveStackerInfo = StackerInfo & {
  stacked: true;
};

interface Props {
  lockedAmount: bigint;
  stackerInfoDetails: ActiveStackerInfo['details'];
  rewardCycleId: number;
}

export function ActiveStackingInfo({
  lockedAmount,
  stackerInfoDetails: details,
  rewardCycleId,
}: Props) {
  const { client } = useStackingClient();
  const navigate = useNavigate();
  const [isContractCallExtensionPageOpen, setIsContractCallExtensionPageOpen] = useState(false);

  const elapsedCyclesSinceStackingStart = Math.max(rewardCycleId - details.first_reward_cycle, 0);
  const elapsedStackingCycles = Math.min(elapsedCyclesSinceStackingStart, details.lock_period);
  const isBeforeFirstRewardCycle = rewardCycleId < details.first_reward_cycle;
  const poxAddress = formatPoxAddressToNetwork(details.pox_address);

  async function handleLockMoreClick() {
    navigate('../lock-more-stx');
  }

  async function handleExtendStackingClick() {
    navigate('../extend-stacking');
  }

  return (
    <Flex height="100%" justify="center" align="center">
      <InfoCard width="420px">
        <Box mx={['loose', 'extra-loose']}>
          <Flex flexDirection="column" pt="extra-loose" pb="base-loose">
            <Text textStyle="body.large.medium">You&apos;re stacking</Text>
            <Text
              fontSize="24px"
              fontFamily="Open Sauce"
              fontWeight={500}
              letterSpacing="-0.02em"
              mt="extra-tight"
            >
              {toHumanReadableStx(lockedAmount)}
            </Text>

            {isBeforeFirstRewardCycle && (
              <>
                <Box pb="base-loose"></Box>
                <Alert icon={<IconClockHour4 />} title="Waiting for the cycle to start">
                  Your STX are ready for stacking. Once the next cycle starts the network will
                  determine if and how many slots are claimed.
                </Alert>
              </>
            )}

            <Hr />

            <Group pt="base-loose">
              <Section>
                <Row>
                  <Label>Duration</Label>
                  <Value>
                    {elapsedStackingCycles} / {details.lock_period}
                  </Value>
                </Row>
                <Row>
                  <Label>Start</Label>
                  <Value>Cycle {details.first_reward_cycle}</Value>
                </Row>
                <Row>
                  <Label explainer="This is your last stacking cycle.">End</Label>
                  <Value>Cycle {details.first_reward_cycle + details.lock_period - 1} </Value>
                </Row>
                <Row>
                  <Label>Bitcoin address</Label>
                  <Value>
                    <Address address={poxAddress} />
                  </Value>
                </Row>
                <Row mt="loose" justifyContent="space-evenly">
                  <Button
                    mode="tertiary"
                    onClick={handleLockMoreClick}
                    isLoading={isContractCallExtensionPageOpen}
                  >
                    Lock more STX
                  </Button>
                  <Button
                    mode="tertiary"
                    onClick={handleExtendStackingClick}
                    isLoading={isContractCallExtensionPageOpen}
                  >
                    Extend stacking
                  </Button>
                </Row>
              </Section>

              <Section>
                <OpenExternalLinkInNewTab
                  href={makeStackingClubRewardAddressLink(
                    String(formatPoxAddressToNetwork(details.pox_address))
                  )}
                >
                  🥞 View on stacking.club
                </OpenExternalLinkInNewTab>
              </Section>
            </Group>
          </Flex>
        </Box>
      </InfoCard>
    </Flex>
  );
}
