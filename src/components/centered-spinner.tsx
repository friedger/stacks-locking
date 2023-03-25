import { Flex, Spinner } from '@stacks/ui';

export function CenteredSpinner() {
  return (
    <Flex justify="center" align="center" m="loose" p="loose">
      <Spinner />
    </Flex>
  );
}
