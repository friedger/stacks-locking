import { Box, color, Stack, StackProps } from '@stacks/ui';
import { FiAlertCircle } from 'react-icons/fi';

export function Info({ children, ...rest }: StackProps) {
  return (
    <Stack
      spacing="tight"
      color={color('feedback-alert')}
      isInline
      alignItems="flex-start"
      {...rest}
    >
      <Box
        size="1rem"
        color={color('feedback-alert')}
        as={FiAlertCircle}
        position="relative"
        top="2px"
        strokeWidth={1.5}
      />
      <Box>{children}</Box>
    </Stack>
  );
}
