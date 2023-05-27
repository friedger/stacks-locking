import { Stack } from '@stacks/ui';
import { IconCheck } from '@tabler/icons-react';

import { useStacksNetwork } from '@hooks/use-stacks-network';

import { Action } from '../../components/stacking-form-step';
import { PoolWrapperAllowanceState } from '../types';
import { PoolName } from '../types-preset-pools';
import { getPox3Contracts } from '../utils-preset-pools';
import { pools } from './preset-pools';

export function ActionsForWrapperContract({
  isDisabled,
  poolName,
  hasUserConfirmedPoolWrapperContract,
}: {
  isDisabled: boolean;
  hasUserConfirmedPoolWrapperContract: PoolWrapperAllowanceState;
  poolName: PoolName;
}) {
  const { network, networkInstance } = useStacksNetwork();
  const pox3Contracts = getPox3Contracts(network);
  const pool = pools[poolName];
  const poxWrapperContract = pool.poxContract;
  const hasUserConfirmed =
    hasUserConfirmedPoolWrapperContract[networkInstance]?.[pox3Contracts[poxWrapperContract]];

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
