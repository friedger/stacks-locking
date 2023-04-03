import { useNavigate } from 'react-router-dom';

import { AccountExtendedBalances, StackerInfo } from '@stacks/stacking';
import { Box, Button, Flex, Text } from '@stacks/ui';
import { IconLock } from '@tabler/icons-react';

import { BaseDrawer } from '@components/drawer/base-drawer';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardRow as Row,
  InfoCardSection as Section,
} from '@components/info-card';
import routes from '@constants/routes';
import { toHumanReadableStx } from '@utils/unit-convert';

import { Amount } from './choose-amount';

interface ChangeDirectStackingLayoutProps {
  title: string;
  details: (StackerInfo & { stacked: true })['details'];
  extendedStxBalances: AccountExtendedBalances['stx'];
  rewardCycleId: number;
  isContractCallExtensionPageOpen: boolean;
}
export function ChangeDirectStackingLayout(props: ChangeDirectStackingLayoutProps) {
  const { title, details, extendedStxBalances, rewardCycleId, isContractCallExtensionPageOpen } =
    props;
  const navigate = useNavigate();
  const elapsedCyclesSinceStackingStart = Math.max(rewardCycleId - details.first_reward_cycle, 0);
  const elapsedStackingCycles = Math.min(elapsedCyclesSinceStackingStart, details.lock_period);
  const isBeforeFirstRewardCycle = rewardCycleId < details.first_reward_cycle;
  const onClose = () => {
    navigate(routes.DIRECT_STACKING_INFO);
  };
  return (
    <BaseDrawer title={title} isShowing onClose={onClose}>
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
                {toHumanReadableStx(extendedStxBalances.locked.toString())}
              </Text>
            </Flex>
            <Hr />

            <Group pt="base-loose">
              <Section>
                <Row>
                  <Amount />
                </Row>

                <Row m="loose" justifyContent="space-between">
                  <Button mode="tertiary" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button isLoading={isContractCallExtensionPageOpen}>
                    <Box mr="loose">
                      <IconLock />
                    </Box>
                    Confirm Increase
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
