import { Text, BoxProps } from "@stacks/ui";

export function StackingDescription({ children, ...props }: BoxProps) {
  return (
    <Text textStyle="body.large" display="block" {...props}>
      {children}
    </Text>
  );
}
