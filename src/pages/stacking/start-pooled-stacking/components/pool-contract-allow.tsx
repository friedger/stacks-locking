import { PoolName } from '../types-preset-pools';
import { pools } from './preset-pools';
import { Spinner, Stack } from '@stacks/ui';
import { useGetAllowanceContractCallers } from '@components/stacking-client-provider/stacking-client-provider';
import { ErrorAlert } from '@components/error-alert';
import { ClarityType } from '@stacks/transactions';
import { Action } from '../../components/stacking-form-step';
import { PoolWrapperAllowanceState } from '../types';

export function ActionsForWrapperContract({
  poolName,
  hasUserConfirmedPoolWrapperContract,
  setHasUserConfirmedPoolWrapperContract,
}: {
  hasUserConfirmedPoolWrapperContract: PoolWrapperAllowanceState;
  setHasUserConfirmedPoolWrapperContract: React.Dispatch<
    React.SetStateAction<PoolWrapperAllowanceState>
  >;
  poolName: PoolName;
}) {
  const pool = pools[poolName];
  const q = useGetAllowanceContractCallers(pool.poxContract);
  if (q.isLoading) {
    return <Spinner />;
  }
  if (q.isError || !q.data) {
    const msg = 'Error retrieving contract caller allowance.';
    const id = 'bf90b490-5b68-4e1f-8a30-151aabd89e1b';
    console.error(id, msg, q);
    return <ErrorAlert id={id}>{msg}</ErrorAlert>;
  }
  const hasUserConfirmed = q.data.type === ClarityType.OptionalSome;

  return (
    <Stack>
      <Action
        type="submit"
        // TODO
        // isLoading={isLoading}
        isDisabled={hasUserConfirmedPoolWrapperContract[pool.poxContract] || hasUserConfirmed}
      >
        Step 1: Allow pool contract
      </Action>
      <Action
        type="submit"
        // TODO
        // isLoading={isLoading}
        isDisabled={!hasUserConfirmedPoolWrapperContract}
      >
        Step 2: Confirm and start pooling
      </Action>
    </Stack>
  );
}
