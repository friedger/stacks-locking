import { Checkbox } from "@mantine/core";

interface StackingUserConfirmProps {
  onChange(userConfirmed: boolean): void;
}

export function StackingUserConfirm(props: StackingUserConfirmProps) {
  const { onChange } = props;
  return (
    <Checkbox
      label="I have read and understand the above"
      onChange={(e) => onChange(e.target.checked)}
    />
  );
}
