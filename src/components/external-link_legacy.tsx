import { ReactNode } from "react";

import { Anchor, AnchorProps } from "@mantine/core";

import { LegalDisclaimerTooltip } from "./legal-disclaimer-tooltip";

interface ExternalLinkProps extends AnchorProps {
  children: ReactNode;
  href: string;
}
export function ExternalLink({ children, href }: ExternalLinkProps) {
  return (
    <LegalDisclaimerTooltip>
      <Anchor
        // Ensures the width of the element is kept to that of the content, so if converted to a
        // block when used as a flex item, it's width will remain that of the text within it.
        w="fit-content"
        href={href}
        target="_blank"
        sx={{ whiteSpace: "nowrap" }}
      >
        {children} ↗
      </Anchor>
    </LegalDisclaimerTooltip>
  );
}
