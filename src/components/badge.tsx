import { Flex, FlexProps, Text } from '@stacks/ui';
import { forwardRefWithAs } from '@stacks/ui-core';

export type BadgeProps = FlexProps;
export const Badge = forwardRefWithAs<BadgeProps, 'div'>(({ children, ...rest }, ref) => (
  <Flex
    ref={ref}
    alignItems="center"
    justify="center"
    borderRadius="24px"
    py="4px"
    px={['8px', '8px', '12px']}
    color="white"
    borderWidth="1px"
    {...rest}
  >
    <Text
      display="block"
      lineHeight="16px"
      fontSize={['10px', '10px', '11px']}
      fontWeight={600}
      color="currentColor"
    >
      {children}
    </Text>
  </Flex>
));
