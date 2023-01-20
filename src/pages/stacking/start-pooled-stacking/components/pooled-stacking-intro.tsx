import { Title } from '@components/title';
import { NextCycleStartTime } from '../../components/next-cycle-start-time';

interface PooledStackingIntroProps {
  /**
   * Time, in seconds, until the start of the next cycle.
   */
  timeUntilNextCycle: number;
}
export function PooledStackingIntro({ timeUntilNextCycle }: PooledStackingIntroProps) {
  return (
    <>
      <Title>Stack in a pool</Title>
      <NextCycleStartTime timeUntilNextCycle={timeUntilNextCycle} />
    </>
  );
}
