import React from 'react';

import { Box, BoxProps, Flex, Text, color } from '@stacks/ui';

interface CardProps extends BoxProps {
  title?: string;
}

export function Card({ title, children, ...rest }: CardProps) {
  return (
    <Box
      borderRadius="6px"
      border="1px solid"
      borderColor={color('border')}
      boxShadow="mid"
      textAlign="center"
      width="100%"
      {...rest}
    >
      {title && (
        <Flex
          borderBottom="1px solid"
          borderColor={color('border')}
          height="40px"
          justifyContent="center"
          alignItems="center"
        >
          <Text textStyle="caption" color={color('text-caption')}>
            {title}
          </Text>
        </Flex>
      )}
      <Box my="base" mx="base">
        {children}
      </Box>
    </Box>
  );
}
