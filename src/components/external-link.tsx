import { BoxProps } from '@stacks/ui';

import { LegalDisclaimerTooltip } from './legal-disclaimer-tooltip';
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
