import { color } from '@stacks/ui';
import { StackerInfoDetails } from 'src/types/stacking';

import { Address } from '@components/address';
import {
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardValue as Value,
} from '@components/info-card';
import { useGetPoxInfoQuery } from '@components/stacking-client-provider/stacking-client-provider';

interface StackerDetailsRowsProps {
  stackerInfoDetails: StackerInfoDetails;
  poxAddress: string;
}
export function StackerDetailsRows({ stackerInfoDetails, poxAddress }: StackerDetailsRowsProps) {
  const getPoxInfoQuery = useGetPoxInfoQuery();
  const lastCycle = stackerInfoDetails.first_reward_cycle + stackerInfoDetails.lock_period - 1;
  const requiresExtension =
    getPoxInfoQuery.data && getPoxInfoQuery.data.current_cycle.id >= lastCycle;
  return (
    <>
      <Row>
        <Label>Start</Label>
        <Value>Cycle {stackerInfoDetails.first_reward_cycle} </Value>
      </Row>
      <Row>
        <Label
          explainer={
            requiresExtension
              ? 'STX will unlock after the current cycle. For continous stacking, you need to extend your pooled stacking.'
              : 'STX will unlock after that cycle'
          }
        >
          End
        </Label>
        <Value color={requiresExtension ? color('feedback-error') : undefined}>
          Cycle {lastCycle}
        </Value>
      </Row>

      <Row>
        <Label>Pool reward address</Label>
        <Value>
          <Address address={poxAddress} />
        </Value>
      </Row>
    </>
  );
}
