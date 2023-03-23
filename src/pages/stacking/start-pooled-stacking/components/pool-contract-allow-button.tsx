import { Pox2Contract } from '../types-preset-pools';
import { Button, Text, color } from '@stacks/ui';

export function PoolContractAllowButton({
  poxWrapperContract,
  handleSubmit,
}: {
  poxWrapperContract: Pox2Contract;
  handleSubmit(val: Pox2Contract): Promise<void>;
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

      <Button size="sm" mx="loose" onClick={() => handleSubmit(poxWrapperContract)}>
        Allow pool contract
      </Button>
    </>
  );
}
