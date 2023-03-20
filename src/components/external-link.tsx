import { LegalDisclaimerTooltip } from './legal-disclaimer-tooltip';
import { Box, BoxProps, Text, color } from '@stacks/ui';
import { openExternalLink } from '@utils/external-links';

interface ExternalLinkProps extends BoxProps {
  href: string;
}

export function ExternalLink({ href, children, ...props }: ExternalLinkProps) {
  const openUrl = () => openExternalLink(href);
  return (
    <LegalDisclaimerTooltip display="inline-block">
      <Text
        onClick={openUrl}
        as="button"
        type="button"
        cursor="pointer"
        display="block"
        outline={0}
        color={color('brand')}
        _hover={{ textDecoration: 'underline' }}
        _focus={{ textDecoration: 'underline' }}
        {...props}
      >
        {children}
        <Box display="inline-block" ml="extra-tight" mb="1px">
          ↗
        </Box>
      </Text>
    </LegalDisclaimerTooltip>
  );
}
