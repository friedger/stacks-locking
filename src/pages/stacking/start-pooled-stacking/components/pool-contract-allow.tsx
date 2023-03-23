import { PoolName, Pox2Contract } from '../types-preset-pools';
import { PoolContractAllowButton } from './pool-contract-allow-button';
import { pools } from './preset-pools';
import { Spinner } from '@stacks/ui';
import { useGetAllowanceContractCallers } from '@components/stacking-client-provider/stacking-client-provider';
import { ErrorAlert } from '@components/error-alert';
import { ClarityType } from '@stacks/transactions';

export function PoolContractAllow({
  poolName,
  handleSubmit,
}: {
  poolName: PoolName;
  handleSubmit(val: Pox2Contract): Promise<void>;
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
  if (q.data.type === ClarityType.OptionalSome) {
    return <></>;
  } else {
    return (
      <PoolContractAllowButton poxWrapperContract={pool.poxContract} handleSubmit={handleSubmit} />
    );
  }
}
