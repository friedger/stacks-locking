import { Flex } from '@stacks/ui';

import { Title } from '@components/title';

import { EstimatedMinimumLabel } from '../../components/estimated-minimum-label';
import { NextCycleStartTime } from '../../components/next-cycle-start-time';
import { StackingDescription } from '../../components/stacking-description';

interface PoolAdminIntroProps {
  /**
   * Time, in seconds, until the start of the next cycle.
   */
  timeUntilNextCycle: number;

  /**
   * Estimated amount of uSTX needed to start stacking.
   */
  estimatedStackingMinimum: bigint;

  /**
   * Description text for the pool admin intro.
   */
  children: React.ReactNode;
}
export function PoolAdminIntro(props: PoolAdminIntroProps) {
  const { timeUntilNextCycle, estimatedStackingMinimum, children } = props;
  return (
    <>
      <Title>Manage your pool</Title>
      <StackingDescription mt="base-loose">{children}</StackingDescription>
      <Flex alignItems="baseline">
        <NextCycleStartTime timeUntilNextCycle={timeUntilNextCycle} mt="40px" />
        <EstimatedMinimumLabel
          ml="extra-loose"
          estimatedStackingMinimum={estimatedStackingMinimum}
        />
      </Flex>
    </>
  );
}
