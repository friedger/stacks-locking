import { PoolName, Pox2Contract } from '../types-preset-pools';
import { Button, Text, color } from '@stacks/ui';

export function PoolContractAllowButton({
  poolName,
  handleSubmit,
}: {
  poolName: PoolName;
  handleSubmit(val: Pox2Contract): void;
}) {
  return (
    <>
      <Text
        textStyle="body.small"
        color={color('text-caption')}
        mt="tight"
        display="inline-block"
        lineHeight="18px"
      >
        The pool uses a contract to handle your stacking. You need to allow the contract to confirm
        your delegation.
      </Text>

      <Button size="sm" mx="loose" onClick={() => handleSubmit(poolName)}>
        Allow pool contract
      </Button>
    </>
  );
}
