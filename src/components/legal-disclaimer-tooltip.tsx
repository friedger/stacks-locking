import { Tooltip, TooltipProps } from '@mantine/core';

export function LegalDisclaimerTooltip(props: Omit<TooltipProps, 'label'>) {
  return (
    <Tooltip
      // Setting the tooltip to render within a portal prevents it from being cut off when rendering
      // and overflowing inside elements hiding their overflow.
      withinPortal={true}
      multiline
      withArrow
      width={220}
      label="This link will take you to an external third-party website that is not affiliated with Hiro Systems PBC."
      {...props}
    />
  );
}
