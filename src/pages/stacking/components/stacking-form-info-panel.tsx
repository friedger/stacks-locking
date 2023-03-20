import { Flex, FlexProps } from '@stacks/ui';

export function StackingFormInfoPanel(props: FlexProps) {
  return (
    <Flex
      flexDirection="column"
      position="sticky"
      minWidth={[null, null, '360px', '420px']}
      top="124px"
      {...props}
    />
  );
}
