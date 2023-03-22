import { Pool, PoolName } from '../types-preset-pools';
import { PoolContractAllowButton } from './pool-contract-allow-button';
import { poolByName } from './preset-pools';
import { Text, color } from '@stacks/ui';
import { truncateMiddle } from '@utils/tx-utils';

export function userHasAllowedContractCallerForPool(pool: Pool) {
  return pool.name === PoolName.PlanBetter;
}

export function PoolContractAllow({
  poolName,
  handleSubmit,
}: {
  poolName: PoolName;
  handleSubmit(poolName: PoolName): void;
}) {
  const pool = poolByName(poolName);
  if (userHasAllowedContractCallerForPool(pool)) {
    return (
      <Text
        textStyle="body.small"
        color={color('text-caption')}
        mt="tight"
        display="inline-block"
        lineHeight="18px"
      >
        Uses pool contract {truncateMiddle(pool.poxContract)}: Allowed.
      </Text>
    );
  } else {
    return <PoolContractAllowButton poolName={poolName} handleSubmit={handleSubmit} />;
  }
}
