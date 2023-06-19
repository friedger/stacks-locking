import { StackerInfo } from '@stacks/stacking';
import { StackerInfoDetails } from 'src/types/stacking';

import {
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardValue as Value,
} from '@components/info-card';

interface ProgressRowProps {
  stackerInfo: StackerInfo;
  rewardCycleId: number;
}

export function ProgressRow({ stackerInfo, rewardCycleId }: ProgressRowProps) {
  return (
    <Row>
      <Label>Progress</Label>
      <Value>
        {stackerInfo.stacked ? (
          <StackingDuration
            stackerInfoDetails={stackerInfo.details}
            rewardCycleId={rewardCycleId}
          />
        ) : (
          <>-</>
        )}
      </Value>
    </Row>
  );
}

interface StackingDurationProps {
  stackerInfoDetails: StackerInfoDetails;
  rewardCycleId: number;
}

function StackingDuration({ stackerInfoDetails, rewardCycleId }: StackingDurationProps) {
  const elapsedCyclesSinceStackingStart = Math.max(
    rewardCycleId - stackerInfoDetails.first_reward_cycle,
    0
  );
  const elapsedStackingCycles = Math.min(
    elapsedCyclesSinceStackingStart,
    stackerInfoDetails.lock_period
  );
  return (
    <>
      {elapsedStackingCycles} / {stackerInfoDetails.lock_period}
    </>
  );
}
