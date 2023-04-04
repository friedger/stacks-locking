import { StackerInfo } from '@stacks/stacking';
import { Box, Flex, Text } from '@stacks/ui';
import { IconClockHour4 } from '@tabler/icons-react';

import { Address } from '@components/address';
import { Alert, AlertText } from '@components/alert';
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
import { makeStackingClubRewardAddressLink } from '@utils/external-links';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { toHumanReadableStx } from '@utils/unit-convert';

import { PendingStackExtendAlert } from '../../components/pending-stack-extend-alert';
import { StackExtendInfo } from '../get-has-pending-stack-extend';
import { StackIncreaseInfo } from '../get-has-pending-stack-increase';
import { ActionButtonsRow } from './action-buttons-row';

type ActiveStackerInfo = StackerInfo & {
  stacked: true;
};

interface Props {
  lockedAmount: bigint;
  stackerInfoDetails: ActiveStackerInfo['details'];
  rewardCycleId: number;
  pendingStackIncrease: StackIncreaseInfo | undefined | null;
  pendingStackExtend: StackExtendInfo | undefined | null;
}

export function ActiveStackingInfo({
  lockedAmount,
  stackerInfoDetails: details,
  rewardCycleId,
  pendingStackExtend,
  pendingStackIncrease,
}: Props) {
  const elapsedCyclesSinceStackingStart = Math.max(rewardCycleId - details.first_reward_cycle, 0);
  const elapsedStackingCycles = Math.min(elapsedCyclesSinceStackingStart, details.lock_period);
  const isBeforeFirstRewardCycle = rewardCycleId < details.first_reward_cycle;
  const poxAddress = formatPoxAddressToNetwork(details.pox_address);

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
              <Box pb="base-loose">
                <Alert icon={<IconClockHour4 />} title="Waiting for the cycle to start">
                  Your STX are ready for stacking. Once the next cycle starts the network will
                  determine if and how many slots are claimed.
                </Alert>
              </Box>
            )}

            {pendingStackIncrease && (
              <Box pb="base-loose">
                <Alert icon={<IconClockHour4 />} title="Waiting for transaction confirmation">
                  <AlertText>
                    A stacking request was successfully submitted to the blockchain. Once confirmed,
                    an additional amount of {toHumanReadableStx(pendingStackIncrease.increaseBy)}{' '}
                    will be stacking.
                  </AlertText>
                </Alert>
              </Box>
            )}

            {pendingStackExtend && (
              <PendingStackExtendAlert pendingStackExtend={pendingStackExtend} />
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
                <ActionButtonsRow />
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
