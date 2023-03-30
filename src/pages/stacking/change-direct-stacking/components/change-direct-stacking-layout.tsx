import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StackerInfo } from '@stacks/stacking';
import { Box, Button, Flex, Input, Text } from '@stacks/ui';
import BigNumber from 'bignumber.js';

import { Address } from '@components/address';
import { BaseDrawer } from '@components/drawer/base-drawer';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import routes from '@constants/routes';
import { formatPoxAddressToNetwork } from '@utils/stacking';
import { stxToMicroStx } from '@utils/unit-convert';

interface ChangeDirectStackingLayoutProps {
  title: string;
  details: (StackerInfo & { stacked: true })['details'];
  rewardCycleId: number;
  handleLockMore: ({ increaseBy }: { increaseBy: BigNumber }) => Promise<void>;
  isContractCallExtensionPageOpen: boolean;
}
export function ChangeDirectStackingLayout(props: ChangeDirectStackingLayoutProps) {
  const { title, details, rewardCycleId, handleLockMore, isContractCallExtensionPageOpen } = props;
  const navigate = useNavigate();
  const elapsedCyclesSinceStackingStart = Math.max(rewardCycleId - details.first_reward_cycle, 0);
  const elapsedStackingCycles = Math.min(elapsedCyclesSinceStackingStart, details.lock_period);
  const isBeforeFirstRewardCycle = rewardCycleId < details.first_reward_cycle;
  const poxAddress = formatPoxAddressToNetwork(details.pox_address);

  const [increaseBy, setIncreaseBy] = useState<string>('1');
  return (
    <BaseDrawer title={title} isShowing onClose={() => navigate(routes.HOME)}>
      <Flex alignItems="center" flexDirection="column" pb={['loose', '48px']} px="loose">
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
                since cycle {details.first_reward_cycle}
              </Text>
            </Flex>
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
                  <Label>End</Label>
                  <Value>Cycle {details.first_reward_cycle + details.lock_period - 1} </Value>
                </Row>
                <Row>
                  <Label>Bitcoin address</Label>
                  <Value>
                    <Address address={poxAddress} />
                  </Value>
                </Row>
                <Row>
                  <Text>Amount of STX to add</Text>
                </Row>
                <Row>
                  <Input
                    onChange={e => setIncreaseBy((e.target as HTMLInputElement).value)}
                  ></Input>
                </Row>

                <Row m="loose" justifyContent="space-evenly">
                  <Button
                    onClick={() => handleLockMore({ increaseBy: stxToMicroStx(increaseBy) })}
                    isLoading={isContractCallExtensionPageOpen}
                  >
                    Lock more STX
                  </Button>
                </Row>
              </Section>
            </Group>
          </Box>
        </InfoCard>
      </Flex>
    </BaseDrawer>
  );
}
