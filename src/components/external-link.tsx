import { LegalDisclaimerTooltip } from './legal-disclaimer-tooltip';
import { Box, BoxProps, Text, color } from '@stacks/ui';
import { OpenLinkInNewTab } from './open-link-in-new-tab';

interface ExternalLinkProps extends BoxProps {
  href: string;
}

export function OpenExternalLinkInNewTab({ children, ...props }: ExternalLinkProps) {
  return (
    <LegalDisclaimerTooltip display="inline-block">
      <OpenLinkInNewTab {...props}>{children}</OpenLinkInNewTab>
    </LegalDisclaimerTooltip>
  );
}
