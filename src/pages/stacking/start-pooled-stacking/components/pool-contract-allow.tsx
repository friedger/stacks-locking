import { Pool, PoolName, Pox2Contract } from '../types-preset-pools';
import { PoolContractAllowButton } from './pool-contract-allow-button';
import { pools } from './preset-pools';
import { Text, color, Spinner } from '@stacks/ui';
import { truncateMiddle } from '@utils/tx-utils';
import { useGetAllowanceContractCallers } from '@components/stacking-client-provider/stacking-client-provider';
import { ErrorAlert } from '@components/error-alert';
import { ClarityType } from '@stacks/transactions';
import { PoolContractDisallowButton } from './pool-contract-disallow-button';

export function PoolContractAllow({
  poolName,
  handleSubmit,
  isPoolActive,
}: {
  poolName: PoolName;
  handleSubmit(val: Pox2Contract): void;
  isPoolActive: boolean;
}) {
  const pool = pools[poolName];
  const q = useGetAllowanceContractCallers(pool.poxContract);
  if (q.isLoading) {
    return isPoolActive ? <Spinner /> : <></>;
  }
  if (q.isError || !q.data) {
    const msg = 'Error retrieving contract caller allowance.';
    const id = 'bf90b490-5b68-4e1f-8a30-151aabd89e1b';
    console.error(id, msg, q);
    return isPoolActive ? <ErrorAlert id={id}>{msg}</ErrorAlert> : <></>;
  }
  if (q.data.type === ClarityType.OptionalSome) {
    return (
      <Text
        textStyle="body.small"
        color={color('text-caption')}
        mt="tight"
        display="inline-block"
        lineHeight="18px"
      >
        Uses pool contract {truncateMiddle(pool.poxContract)}: Trusted.
        <PoolContractDisallowButton poolName={poolName} handleSubmit={handleSubmit} />
      </Text>
    );
  } else if (isPoolActive) {
    return <PoolContractAllowButton poolName={poolName} handleSubmit={handleSubmit} />;
  } else {
    return <></>;
  }
}
