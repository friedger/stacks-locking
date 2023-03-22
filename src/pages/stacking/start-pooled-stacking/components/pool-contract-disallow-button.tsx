import { PoolName } from '../types-preset-pools';
import { Button } from '@stacks/ui';

export function PoolContractDisallowButton({
  poolName,
  handleSubmit,
}: {
  poolName: PoolName;
  handleSubmit(poolName: PoolName): void;
}) {
  return (
    <>
      <Button variant="link" size="sm" mx="extra-tight" onClick={() => handleSubmit(poolName)}>
        I don't trust this contract anymore.
      </Button>
    </>
  );
}
