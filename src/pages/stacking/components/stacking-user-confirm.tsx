import { Box, BoxProps, color } from '@stacks/ui';

interface StackingUserConfirmProps extends Omit<BoxProps, 'onChange'> {
  onChange(userConfirmed: boolean): void;
}

export function StackingUserConfirm(props: StackingUserConfirmProps) {
  const { onChange, ...rest } = props;
  return (
    <Box
      as="label"
      display="block"
      py="base"
      textStyle="body.small"
      color={color('text-caption')}
      userSelect="none"
      {...rest}
    >
      <Box mr="base-tight" display="inline-block">
        <input type="checkbox" onChange={e => onChange(e.target.checked)} />
      </Box>
      I have read and understand the above
    </Box>
  );
}
