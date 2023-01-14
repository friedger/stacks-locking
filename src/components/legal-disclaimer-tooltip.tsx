import { Tooltip, TooltipProps } from '@mantine/core';

export function LegalDisclaimerTooltip(props: Omit<TooltipProps, 'label'>) {
  return (
    <Tooltip
      label="This link will take you to an external third-party website that is not affiliated with Hiro Systems PBC."
      {...props}
    />
  );
}
