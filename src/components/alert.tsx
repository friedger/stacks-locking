import { ReactNode } from 'react';
import { FiInfo } from 'react-icons/fi';

import { Box, Flex, Text, color } from '@stacks/ui';

interface Props {
  title?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
}
export function Alert({ title, children: body, icon }: Props) {
  let bodyEl = undefined;
  if (typeof body === 'string') {
    bodyEl = (
      <Text textStyle="body.small" color={color('text-caption')} lineHeight="22px" mt="extra-tight">
        {body}
      </Text>
    );
  } else {
    bodyEl = body;
  }
  return (
    <Box background={color('bg-alt')} py="base" px="base-loose" borderRadius="10px">
      <Flex>
        <Box mr="base-tight" mt="2px">
          {icon ?? <FiInfo color={color('accent')} />}
        </Box>
        <Box>
          {title && <Text textStyle="body.small.medium">{title}</Text>}
          {body && bodyEl}
        </Box>
      </Flex>
    </Box>
  );
}
