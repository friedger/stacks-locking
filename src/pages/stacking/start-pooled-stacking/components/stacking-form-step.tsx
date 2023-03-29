import React, { FC } from 'react';

import { Box, Button, ButtonProps, Flex, FlexProps, Stack } from '@stacks/ui';
import { ForwardRefExoticComponentWithAs, forwardRefWithAs } from '@stacks/ui-core';

import { Title } from '@components/title';

interface StackingFormStepProps extends FlexProps {
  title: string;
}

export const StackingStep: FC<StackingFormStepProps> = props => {
  const { title, children, ...rest } = props;
  return (
    <Flex flexDirection="column" mt="extra-loose" {...rest}>
      <Title fontSize="24px" mt="extra-tight" mr="tight">
        {title}
      </Title>
      <Box>{children}</Box>
    </Flex>
  );
};

export const StackingStepAction: ForwardRefExoticComponentWithAs<ButtonProps, 'button'> =
  forwardRefWithAs(({ children, ...props }, ref) => (
    <Button size="md" mt="loose" ref={ref} {...props}>
      {children}
    </Button>
  ));
