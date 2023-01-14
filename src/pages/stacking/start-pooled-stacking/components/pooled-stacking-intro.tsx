import { Title } from '@mantine/core';
import { NextCycleStartTime } from '../../components/next-cycle-start-time';

interface PooledIntroProps {
  timeUntilNextCycle: string;
}
export function PooledStackingIntro({ timeUntilNextCycle }: PooledIntroProps) {
  return (
    <>
      <Title>Stack in a pool</Title>
      <NextCycleStartTime nextCycleStartsIn={timeUntilNextCycle} />
    </>
  );
}
