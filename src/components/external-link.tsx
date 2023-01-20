import { LegalDisclaimerTooltip } from './legal-disclaimer-tooltip';
import { Anchor, AnchorProps } from '@mantine/core';
import { ReactNode } from 'react';

interface ExternalLinkProps extends AnchorProps {
  children: ReactNode;
  href: string;
}
export function ExternalLink({ children, href }: ExternalLinkProps) {
  return (
    <LegalDisclaimerTooltip>
      <Anchor href={href} target="_blank" sx={{ whiteSpace: 'nowrap' }}>
        {children} ↗
      </Anchor>
    </LegalDisclaimerTooltip>
  );
}
