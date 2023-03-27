import { WrapperPrincipal, PoolName, Pox2Contracts } from '../types-preset-pools';
import { Button } from '@stacks/ui';

export function PoolContractDisallowButton({
  wrapperPrincipal,
  handleSubmit,
}: {
  wrapperPrincipal: WrapperPrincipal;
  handleSubmit(val: WrapperPrincipal): void;
}) {
  return (
    <>
      <Button
        variant="link"
        size="sm"
        mx="extra-tight"
        onClick={() => handleSubmit(wrapperPrincipal)}
      >
        I don't trust this contract anymore.
      </Button>
    </>
  );
}
