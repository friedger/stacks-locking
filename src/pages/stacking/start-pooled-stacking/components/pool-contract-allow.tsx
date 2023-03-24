import { PoolName } from '../types-preset-pools';
import { pools } from './preset-pools';
import { Stack } from '@stacks/ui';
import { Action } from '../../components/stacking-form-step';
import { PoolWrapperAllowanceState } from '../types';
import { IconCheck } from '@tabler/icons-react';

export function ActionsForWrapperContract({
  isDisabled,
  poolName,
  hasUserConfirmedPoolWrapperContract,
}: {
  isDisabled: boolean;
  hasUserConfirmedPoolWrapperContract: PoolWrapperAllowanceState;
  poolName: PoolName;
}) {
  const pool = pools[poolName];
  const poxWrapperContract = pool.poxContract;
  const hasUserConfirmed = hasUserConfirmedPoolWrapperContract[poxWrapperContract];

  return (
    <Stack>
      <Action
        type="submit"
        // TODO
        // isLoading
        isDisabled={isDisabled || hasUserConfirmed}
      >
        Step 1: Allow pool contract {hasUserConfirmed ? <IconCheck /> : null}
      </Action>
      <Action
        type="submit"
        // TODO
        // isLoading={isLoading}
        isDisabled={isDisabled || !hasUserConfirmed}
      >
        Step 2: Confirm and start pooling
      </Action>
    </Stack>
  );
}
